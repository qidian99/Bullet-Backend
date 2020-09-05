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
			source,
			type,
			tags,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const currentRoom = await getCurrentRoom(roomId);

			const bullet = await new Bullet({
				userId: currentUser._id,
				roomId: currentRoom._id,
				source,
				type,
				tags: tags || [],
				timestamp,
				content,
			}).save();

			// console.log(bullet);
			return bullet;
		},
		deleteBullet: async (parent, {
			bulletId
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const bullet = await Bullet.findOne({ _id: bulletId, userId: currentUser._id });
			
			if (!bullet) {
				throw new Error("No bullet found. Either you are not the author or the bulletId is invalid.");
			}

			const deleteRes = await Bullet.deleteOne({ _id: bullet._id });
			if (deleteRes.deletedCount !== 1 || !deleteRes.ok) {
				throw new Error("An error occurred when deleting the bullet.");
			}

			return bullet;
		},
	},
	Query: {
		bullets: async (parent) => {
			return await Bullet.find({});
		},
		bulletsByUser: async (parent, {
			userId,
			roomId,
			type
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const query = {
				userId
			}
			if (roomId) {
				query.roomId = roomId;
			}

			if (type) {
				query.type = type;
			}
			const bullets = await Bullet.find(query);
			return bullets;
		},
		allBulletsInRoom: async (parent, {
			roomId
		}, {
			user
		}) => {

			const currentUser = await getCurrentUser(user);

			const bullets = await Bullet.find({
				roomId
			});

			return bullets;
		}
	}
}