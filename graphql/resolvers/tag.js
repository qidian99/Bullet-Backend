const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
const Room = mongoose.model('Room');
const Bullet = mongoose.model('Bullet');
const Tag = mongoose.model('Tag');

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
	Tag: {
		tagId: (parent) => parent._id,
	},
	Mutation: {},
	Query: {
		tags: async () => {
			return await Tag.find({}, null, {
				sort: {
					count: -1
				}
			});
		},
		searchTagByName: async (parent, {
			name
		}, {
			user
		}) => {
			return Tag.find({
				name: {
					$regex: name,
					$options: 'i',
				}
			})
		}
	}
}