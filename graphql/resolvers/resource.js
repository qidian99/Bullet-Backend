const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
const Room = mongoose.model('Room');
const Bullet = mongoose.model('Bullet');
const Tag = mongoose.model('Tag');
const Resource = mongoose.model('Resource');

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


module.exports = {
	Resource: {
		resourceId: (parent) => parent._id,
		room: (parent) => {
			return Room.findById(parent.roomId);
		},
		creator: (parent) => {
			return User.findById(parent.creator);
		},
		tags: (parent) => Tag.find({ name: parent.tags }),
	},
	Mutation: {
		createResource: async (parent, {
			roomId,
			name,
			description,
			url,
			tags,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const currentRoom = await getCurrentRoom(roomId);

			const param = {
				roomId: currentRoom._id,
				creator: currentUser._id,
				name,
				url,	
				description,
			}

			if (tags) {
				param.tags = await addTags(JSON.parse(tags), null)
			}

			const resource = await new Resource(param).save();
			return resource;
		},
		updateResource: async (parent, {
			resourceId,
			name,
			description,
			url,
			tags,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const resource = await Resource.findById(resourceId);

			if (!resource) {
				throw new Error("Resource update failed: resource does not exist.")
			}

			// TODO: add admin priviledges to update resource
			if (resource.creator.toString() !== currentUser._id.toString()) {
				throw new Error("Resource update failed: you are not the resource creator.")
			}

			if (name) {
				resource.name = name;
			}
			
			if (description) {
				resource.description = description;
			}
			
			if (url) {
				resource.url = url;
			}

			if (tags) {
				resource.tags = await addTags(JSON.parse(tags), resource.tags);
			}

			resource.save();

			return resource;

		},	
		deleteResource: async (parent, {
			resourceId
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);

			// TODO: add admin priviledges to update resource
			const resource = await Resource.findOne({ _id: resourceId, creator: currentUser._id });
			
			// Decrement all tags
			await addTags([], resource.tags);

			if (!resource) {
				throw new Error("Resource deletion failed: no resource found. Either you are not the author or the bulletId is invalid.");
			}

			const deleteRes = await Resource.deleteOne({ _id: resource._id });
			if (deleteRes.deletedCount !== 1 || !deleteRes.ok) {
				throw new Error("Resource deletion failed: an error occurred when deleting the bullet.");
			}

			return resource;
		},
	},
	Query: {
		resources: async (parent) => {
			return await Resource.find({}, null, {
				sort: {
					updatedAt: -1
				}
			});
		},
		resource: async (parent, { resourceId }, { user }) => {
			return await Resource.findById(resourceId);
		},
		findResources: async (parent, {
			userId,
			roomId,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const query = {
			}

			if (userId) {
				query.creator = userId;
			}

			if (roomId) {
				query.roomId = roomId;
			}

			const resources = await Resource.find(query, null, {
				sort: {
					updatedAt: -1
				}
			});
			return resources;
		},
	}
}