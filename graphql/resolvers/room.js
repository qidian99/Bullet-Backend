const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = mongoose.model('User');
const Room = mongoose.model('Room');
const { getUser, getCurrentUser, loadUsersByUsernames } = require('../../util');
const { ObjectId } = require('mongodb');


module.exports = {
	Room: {
		roomId: (parent) => parent._id,
		// users: async (parent) => {
		// 	const ids = parent.map(id => ObjectId(id));
		// 	return User.find({ _id: ids });
		// },
		// admins: async (parent) => {
		// 	const ids = parent.map(id => ObjectId(id));
		// 	return User.find({ _id: ids });
		// }
	},
	Mutation: {
		createRoom: async (parent, { alias, users: userStr, admins: adminsStr, public }, { user }) => {
			const currentUser = await getCurrentUser(user);
			console.log('current user', currentUser);
			console.log('users', userStr)

			const users = await loadUsersByUsernames(JSON.parse(userStr));
			const admins = await loadUsersByUsernames(JSON.parse(adminsStr))

			const room = await new Room({
				alias,
				users: [currentUser],
				admins: admins,
				pending: users.filter((({ username }) => username !== currentUser.username)),
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
		}
	}
}