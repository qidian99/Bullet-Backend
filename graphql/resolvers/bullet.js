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
	getCurrentBullet,
	deleteBullet,
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
		resource: (parent) => {
			return Resource.findById(parent.resourceId);
		},
		room: (parent) => {
			return Room.findById(parent.roomId);
		},
		tags: (parent) => Tag.find({
			name: parent.tags
		}),
	},
	Mutation: {
		createBullet: async (parent, {
			roomId,
			timestamp,
			content,
			source,
			resourceId,
			tags,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const currentRoom = await getCurrentRoom(roomId);
			const currentResource = await getCurrentResource(resourceId);

			const param = {
				userId: currentUser._id,
				roomId: currentRoom._id,
				source,
				resourceId: currentResource._id,
				timestamp,
				content,
			}

			if (tags) {
				param.tags = await addTags(JSON.parse(tags), null)
			} else {
				// Use resource tags instead
				param.tags = await addTags(currentResource.tags, null)
			}

			const bullet = await new Bullet(param).save();

			// console.log(bullet);
			return bullet;
		},
		updateBullet: async (parent, {
			bulletId,
			content,
			resourceId,
			tags,
			timestamp
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const bullet = await getCurrentBullet(bulletId);

			if (!bullet) {
				throw new Error("Bullet update failed: bullet does not exist.")
			}

			if (bullet.userId.toString() !== currentUser._id.toString()) {
				throw new Error("Bullet update failed: you are not the bullet sender.")
			}

			if (content) {
				bullet.content = content;
			}

			if (resourceId) {
				const currentResource = await getCurrentResource(resourceId);
				bullet.resourceId = currentResource._id;
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
			const bullet = await Bullet.findOne({
				_id: bulletId,
				userId: currentUser._id
			});

			if (!bullet) {
				throw new Error("Bullet deletion failed: no bullet found. Either you are not the author or the bulletId is invalid.");
			}

			await deleteBullet(bullet);

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
			resourceId
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

			if (resourceId) {
				query.resourceId = resourceId;
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
			resourceId
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const currentResource = await getCurrentResource(resourceId);
			const currentRoom = await getCurrentRoom(roomId);

			const bullets = await Bullet.find({
				roomId: currentRoom._id,
				resourceId: currentResource._id
			}, null, {
				sort: {
					updatedAt: -1
				}
			});

			return bullets;
		}
	}
}