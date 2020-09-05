const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
const Room = mongoose.model('Room');
const Bullet = mongoose.model('Bullet');
const Resource = mongoose.model('Resource');
const Tag = mongoose.model('Tag');

const {
	getUser,
	getCurrentUser,
	loadUsersByUsernames,
	loadUsersByUserIds,
	getCurrentRoom,
	getCurrentResource,
	addTags,
} = require('../../util');
const {
	ObjectId
} = require('mongodb');


module.exports = {
	Bullet: {
		bulletId: (parent) => parent._id,
		user: (parent) => {
			return User.findById(parent.userId);
		},
		type: (parent) => {
			return Resource.findById(parent.type);
		},
		room: (parent) => {
			return Room.findById(parent.roomId);
		},
		tags: (parent) => Tag.find({ name: parent.tags }),
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
			const currentResource = await getCurrentResource(type);

			const param = {
				userId: currentUser._id,
				roomId: currentRoom._id,
				source,
				type: currentResource._id,
				timestamp,
				content,
			}

			if (tags) {
				param.tags = await addTags(JSON.parse(tags), null)
			}

			const bullet = await new Bullet(param).save();

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
				const currentResource = await getCurrentResource(type);
				bullet.type = currentResource._id;
			}

			if (tags) {
				bullet.tags = await addTags(JSON.parse(tags), bullet.tags);
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

			// Decrement all tags
			await addTags([], bullet.tags);

			const deleteRes = await Bullet.deleteOne({ _id: bullet._id });
			if (deleteRes.deletedCount !== 1 || !deleteRes.ok) {
				throw new Error("An error occurred when deleting the bullet.");
			}

			return bullet;
		},
	},
	Query: {
		bullets: async (parent) => {
			return await Bullet.find({}, null, {
				sort: {
					updatedAt: -1
				}
			});
		},
		bulletsByUser: async (parent, {
			userId,
			roomId,
			source,
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

			if (source) {
				query.source = source;
			}

			if (type) {
				query.type = type;
			}
			const bullets = await Bullet.find(query, null, {
				sort: {
					updatedAt: -1
				}
			});
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
			}, null, {
				sort: {
					updatedAt: -1
				}
			});

			return bullets;
		},
		allBulletsInResource: async (parent, {
			roomId,
			type
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const currentResource = await getCurrentResource(type);
			const currentRoom = await getCurrentRoom(roomId);

			const bullets = await Bullet.find({
				roomId: currentRoom._id,
				type: currentResource._id
			}, null, {
				sort: {
					updatedAt: -1
				}
			});

			return bullets;
		}
	}
}