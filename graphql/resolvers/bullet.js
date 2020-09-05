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
	addTags,
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
				tags: addTags(tags, null),
				timestamp,
				content,
			}).save();

			// console.log(bullet);
			return bullet;
		},
		updateBullet: async (parent, {
			bulletId,
			content,
			type,
			tags,
			timestamp
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const bullet = await Bullet.findById(bulletId);

			if (!bullet) {
				throw new Error("Bullet update failed: bullet does not exist.")
			}

			if (bullet.userId.toString() !== currentUser._id.toString()) {
				throw new Error("Bullet update failed: you are not the bullet sender.")
			}

			if (content) {
				bullet.content = content;
			}

			if (type) {
				bullet.type = type;
			}

			if (tags) {
				bullet.tags = addTags(JSON.parse(tags), bullet.tags);
			}

			if (timestamp) {
				bullet.timestamp = timestamp
			}

			bullet.save();

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