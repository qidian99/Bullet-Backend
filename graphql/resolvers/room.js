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
} = require('../../util');
const {
	ObjectId
} = require('mongodb');


module.exports = {
	Room: {
		roomId: (parent) => parent._id,
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

			const room = await new Room({
				alias,
				users: [currentUser._id],
				admins: admins.map(admin => admin._id),
				pending: [],
				public,
			}).save();


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
	},
	Query: {
		rooms: async (parent) => {
			const rooms = await Room.find({});
			// console.log(rooms[0].users, typeof rooms[0].users);
			return rooms;
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