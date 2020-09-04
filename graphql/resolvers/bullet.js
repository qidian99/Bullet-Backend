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
	loadUsersByUserIds,
	getCurrentRoom,
} = require('../../util');
const {
	ObjectId
} = require('mongodb');
const bullet = require('../../models/bullet');
const room = require('../../models/room');


module.exports = {
	Bullet: {
		bulletId: (parent) => parent._id,
		user: (parent) => {
			return User.findById(parent.userId);
		},
		room: (parent) => {
			return Room.findById(parent.roomId);
		}
	},
	Mutation: {
		createBullet: async (parent, {
			roomId,
			timestamp,
			content,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const currentRoom = await getCurrentRoom(roomId);

			const bullet = await new Bullet({
				userId: currentUser._id,
				roomId: currentRoom._id,
				timestamp,
				content,
			}).save();

			// console.log(bullet);
			return bullet;
		},
	},
	Query: {
		bullets: async (parent) => {
			return await Bullet.find({});
		},
		bulletsByUser: async (parent, { userId, roomId }, { user }) => {
			const currentUser = await getCurrentUser(user);
			const query = { userId }
			if (roomId) {
				query.roomId = roomId;
			}
			const bullets = await Bullet.find(query);
			return bullets;
		},
		allBulletsInRoom: async (parent, { roomId }, { user }) => {
		
			const currentUser = await getCurrentUser(user);

			const bullets = await Bullet.find({ roomId });

			return bullets;
		}
	}
}