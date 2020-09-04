const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
const Room = mongoose.model('Room');
const Bullet = mongoose.model('Bullet');

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
	Bullet: {
		bulletId: (parent) => parent._id,
		user: (parent) => {
			return User.findById(parent.user);
		}
	},
	Mutation: {
		createBullet: async (parent, {
			room,
			timestamp,
			content,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);

			const bullet = await new Bullet({
				user: currentUser._id,
				room,
				timestamp,
				content,
			}).save();

			console.log(bullet);
			return bullet;
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