const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = mongoose.model('User');
const Room = mongoose.model('Room');
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
			const users = await loaderFn(JSON.parse(userStr));
			const admins = await loaderFn(JSON.parse(adminsStr))

			const pendingList = users.filter((user) => {
				// console.log(user._id.toString(), currentUser._id.toString(), user._id.toString() !== currentUser._id.toString())
				return user._id.toString() !== currentUser._id.toString()
			}).map(user => user._id);

			if (!adminsStr.includes(currentUser._id.toString())) {
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
					return currentRoom.map(({ _id }) => _id.toString()).includes(user._id.toString());
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
		deleteRoom: async (parent, { roomId }, { user }) => {
			const currentUser = await getCurrentUser(user)
			const currentRoom = await getCurrentRoom(roomId)

			if (currentRoom.creator.toString() !== currentUser._id.toString()) {
				throw new Error("Room deletion failed: only the creator of the room can delete it.");
			}

			const deleteRes = await Room.deleteOne({ _id: currentRoom._id });

			if (!deleteRes.ok || deleteRes.deletedCount !== 1) {
				throw new Error("Room deletion fail: some error ocurred during deletion process");
			}

			return currentRoom;
		} 
	},
	Query: {
		rooms: async (parent) => {
			const rooms = await Room.find({});
			// console.log(rooms[0].users, typeof rooms[0].users);
			return rooms;
		},
		room: async (parent, { roomId }, { user }) => {
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

			return Room.find(query)
		}
	}
}