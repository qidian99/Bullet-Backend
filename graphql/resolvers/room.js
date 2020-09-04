const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = mongoose.model('User');
const Room = mongoose.model('Room');
const {
	getUser,
	getCurrentUser,
	loadUsersByUsernames,
	loadUsersByUserIds
} = require('../../util');
const {
	ObjectId
} = require('mongodb');


module.exports = {
	Room: {
		roomId: (parent) => parent._id,
		users: async (parent) => {
			return User.find({ _id: {
				$in: parent.users
			}});
		},
		admins: async (parent) => {
			return User.find({ _id: {
				$in: parent.admins
			}});
		},
		pending: async (parent) => {
			return User.find({ _id: {
				$in: parent.pending
			}});
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

			const room = await new Room({
				alias,
				users: [currentUser._id],
				admins: admins.map(admin => admin._id),
				pending: users.filter((user) => user._id !== currentUser._id).map(user => user._id),
				public,
			}).save();

			room.roomId = room._id;

			console.log(room);
			return room;
		},
	},
	Query: {
		rooms: async (parent) => {
			const rooms = await Room.find({});
			console.log(rooms[0].users, typeof rooms[0].users);
			return rooms;
		},
		findRoomInvitations: async (parent, _, { user }) => {
			const currentUser = await getCurrentUser(user);

			const rooms = await Room.find({ pending: currentUser._id })
			return rooms;
		}
	}
}