const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = mongoose.model('User');
const Room = mongoose.model('Room');
const Bullet = mongoose.model('Bullet');
const RoomInvitation = mongoose.model('RoomInvitation');
const {
	getUser,
	getCurrentUser,
	loadUsersByUsernames,
	loadUsersByUserIds,
	INVITATION_ACTIONS,
	getCurrentRoom,
} = require('../../util');
const {
	ObjectId
} = require('mongodb');
const room = require('../../models/room');


module.exports = {
	Room: {
		roomId: (parent) => parent._id,
		creator: async (parent) => {
			return User.findById(parent.creator);
		},
		users: async (parent) => {
			return User.find({
				_id: {
					$in: parent.users
				}
			});
		},
		admins: async (parent) => {
			return User.find({
				_id: {
					$in: parent.admins
				}
			});
		},
		pending: async (parent) => {
			return User.find({
				_id: {
					$in: parent.pending
				}
			});
		}
	},
	Mutation: {
		createRoom: async (parent, {
			alias,
			users: userStr,
			admins: adminsStr,
			public,
			widgets,
			avatar,
			// For adding user by username/id, DON't change it!
			loader = 'id'
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);

			const loaderFn = loader === 'id' ? loadUsersByUserIds : loadUsersByUsernames;
			const usersJSON = JSON.parse(userStr);
			const users = await loaderFn(usersJSON);
			const adminsJSON = JSON.parse(adminsStr);
			const admins = await loaderFn(adminsJSON)

			const pendingList = users.filter((user) => {
				// console.log(user._id.toString(), currentUser._id.toString(), user._id.toString() !== currentUser._id.toString())
				return user._id.toString() !== currentUser._id.toString()
			}).map(user => user._id);

			// Check that all admins is included in user list
			let adminIncludesCurrentUser = false;
			adminsJSON.forEach(adminId => {
				if (!usersJSON.includes(adminId)) {
					throw new Error("Room creation failed: all admins must be in user list.");
				}
				if (adminId === currentUser._id.toString) {
					adminIncludesCurrentUser = true;
				}
			})
			if (!adminIncludesCurrentUser) {
				admins.push(currentUser);
			}

			const newRoom = {
				alias,
				users: [currentUser._id],
				admins: admins.map(admin => admin._id),
				pending: [],
				public,
				avatar,
				creator: currentUser._id,
			}

			if (widgets) {
				newRoom.widgets = JSON.parse(widgets);
			}

			const room = await new Room(newRoom).save();


			await Promise.all(pendingList.map((pendingUser) => {
				// console.log('pendingUser', pendingUser);
				return new RoomInvitation({
					roomId: room._id,
					userId: pendingUser._id,
					accepted: -1,
				}).save();
			}));

			return room;
		},
		updateRoom: async (parent, {
			roomId,
			alias,
			users: userStr,
			admins: adminsStr,
			public,
			widgets,
			avatar,
			// For adding user by username/id, DON't change it!
			loader = 'id'
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const currentRoom = await getCurrentRoom(roomId);
			const loaderFn = loader === 'id' ? loadUsersByUserIds : loadUsersByUsernames;

			if (alias) {
				currentRoom.alias = alias;
			}

			if (userStr) {
				const users = await loaderFn(JSON.parse(userStr));
				const pendingList = users.filter((user) => {
					return currentRoom.map(({
						_id
					}) => _id.toString()).includes(user._id.toString());
				}).map(user => user._id);
				await Promise.all(pendingList.map((pendingUser) => {
					// console.log('pendingUser', pendingUser);
					return new RoomInvitation({
						roomId: room._id,
						userId: pendingUser._id,
						accepted: -1,
					}).save();
				}));
				currentRoom.users = users;
			}

			if (adminsStr) {
				const admins = await loaderFn(JSON.parse(adminsStr))
				if (!adminsStr.includes(currentUser._id.toString())) {
					admins.push(currentUser);
				}
			}

			if (public !== undefined) {
				currentRoom.public = public;
			}

			if (widgets) {
				currentRoom.widgets = JSON.parse(widgets);
			}

			if (avatar) {
				currentRoom.avatar = avatar;
			}

			await currentRoom.save();

			return currentRoom;
		},
		deleteRoom: async (parent, {
			roomId
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user)
			const currentRoom = await getCurrentRoom(roomId)

			if (currentRoom.creator.toString() !== currentUser._id.toString()) {
				throw new Error("Room deletion failed: only the creator of the room can delete it.");
			}

			const deleteRes = await Room.deleteOne({
				_id: currentRoom._id
			});

			if (!deleteRes.ok || deleteRes.deletedCount !== 1) {
				throw new Error("Room deletion fail: some error ocurred during deletion process");
			}

			// Invalidate all pending room invitations
			await RoomInvitation.updateMany({
				roomId,
				accepted: -1
			}, {
				$set: {
					accepted: -2
				}
			})

			return currentRoom;
		}
	},
	Query: {
		rooms: async (parent) => {
			const rooms = await Room.find({}, null, {
				sort: {
					updatedAt: -1
				}
			});
			// console.log(rooms[0].users, typeof rooms[0].users);
			return rooms;
		},
		room: async (parent, {
			roomId
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const currentRoom = await getCurrentRoom(roomId);

			if (currentRoom.public === false && !currentRoom.users.includes(currentUser._id)) {
				throw new Error("Room retrieval failed: room is private.");
			}

			return currentRoom;
		},
		allRooms: async (parent, {
			userId
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);

			let query;
			// console.log(typeof currentUser._id)
			if (userId && ObjectId(userId) !== currentUser._id) {
				query = {
					users: ObjectId(userId)
				}
			} else {
				query = {
					users: ObjectId(currentUser._id)
				}
			}

			return Room.find(query, null, {
				sort: {
					updatedAt: -1
				}
			})
		},
		aggregateBulletsInRoom: async (parent, {
			roomId
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const currentRoom = await getCurrentRoom(roomId);

			if (currentRoom.public === false && !currentRoom.users.includes(currentUser._id)) {
				throw new Error("Room retrieval failed: room is private.");
			}

			// Aggregate bullets by source

			const aggregate = await Bullet.aggregate([{
					$match: {
						roomId: ObjectId(roomId),
					}
				},
				// {
				// 	$lookup: {
				// 		from: "rooms",
				// 		localField: "roomId",
				// 		foreignField: "_id",
				// 		as: "rooms"
				// 	}
				// },
				// {
				// 	"$unwind": "$rooms"
				// },
				{
					$group: {
						_id: {
							source: "$source"
						},
						updatedAt: {
							$max: "$updatedAt"
						},
						bullets: {
							$push: {
								_id: "$_id",
								tags: "$tags",
								userId: "$userId",
								timestamp: "$timestamp",
								content: "$content",
								createdAt: "$createdAt:",
								updatedAt: "$updatedAt",
							}
						},
					}
				},
				{
					$project: {
						source: "$_id.source",
						updatedAt: "$updatedAt",
						bullets: "$bullets",
					}
				},
				{
					$sort: {
						updatedAt: -1
					}
				},
			])

			// console.log(aggregate);

			return aggregate;
		},
		videoTeasersInRoom: async (parent, {
			roomId,
			limit = 2,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const currentRoom = await getCurrentRoom(roomId);

			if (currentRoom.public === false && !currentRoom.users.includes(currentUser._id)) {
				throw new Error("Room retrieval failed: room is private.");
			}

			// Aggregate bullets by source
			const aggregate = await Bullet.aggregate([{
					$match: {
						roomId: ObjectId(roomId),
					}
				},
				{
					$group: {
						_id: {
							source: "$source"
						},
						updatedAt: {
							$max: "$updatedAt"
						},
					}
				},
				{
					$project: {
						source: "$_id.source",
						updatedAt: "$updatedAt",
					}
				},
				{
					$sort: {
						updatedAt: -1
					}
				}
			])

			const result = [];
			await Promise.all(aggregate.map(async (agg) => {
				const bullets = await Bullet.aggregate([{
						$match: {
							roomId: ObjectId(roomId),
							source: agg.source,
						}
					},
					{
						$sort: {
							updatedAt: -1
						}
					},
					{
						$limit: limit,
					}
				]);
				result.push({
					source: agg.source,
					updatedAt: agg.updatedAt,
					bullets
				})
			}))

			// console.log(result);

			return result;
		}
	},

}