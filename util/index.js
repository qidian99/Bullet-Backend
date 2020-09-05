const mongoose = require('mongoose');

const User = mongoose.model('User');
const Room = mongoose.model('Room');
const Tag = mongoose.model('Tag');
const Resource = mongoose.model('Resource');
const Bullet = mongoose.model('Bullet');

const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const { INVITATION_TYPES, INVITATION_ACTIONS } = require('./types');

const getUser = token => {
	try {
		if (token) {
			return jwt.verify(token, process.env.JWT_SECRET)
		}
		return null
	} catch (err) {
		return null
	}
};

const getCurrentUser = async (user) => {

	const ERR_STR = "Current user retrieval failed: user does not exist";
	if (!user) {
		throw new Error(ERR_STR);
	}
	const userObj = await User.findOne({
		username: user.username
	})
	if (!userObj) {
		throw new Error(ERR_STR);
	}
	return userObj;
};

const getCurrentRoom = async (roomId) => {
	const ERR_STR = "Room retrieval failed: room does not exist";

	if (!roomId) {
		throw new Error(ERR_STR);
	}
	const room = await Room.findById(roomId);

	if (!room) {
		throw new Error(ERR_STR);
	}
	return room;
};

const getCurrentResource = async (resourceId) => {
	const ERR_STR = "Resource retrieval failed: resource does not exist";

	if (!resourceId) {
		throw new Error(ERR_STR);
	}
	const resource = await Resource.findById(resourceId);

	if (!resource) {
		throw new Error(ERR_STR);
	}
	return resource;
};


const getCurrentBullet = async (bulletId) => {
	const ERR_STR = "Bullet retrieval failed: bullet does not exist";

	if (!bulletId) {
		throw new Error(ERR_STR);
	}
	const bullet = await Bullet.findById(bulletId);

	if (!bullet) {
		throw new Error(ERR_STR);
	}
	return bullet;
};


const loadUsersByUsernames = async (usernames) => {
	const users = await User.find({
		username: {
			$in: usernames
		}
	});
	// console.log('loadUsersByUsernames', users);
	if (!users) {
		throw new Error("Users retrieval failed: invalid usernames");
	}
	return users;
};


const loadUsersByUserIds= async (ids) => {
	const objectIds = ids.map(id => ObjectId(id));
	const users = await User.find({
		_id: {
			$in: objectIds
		}
	});
	if (!users) {
		throw new Error("Users retrieval failed: invalid user ids");
	}
	return users;
};

const generateJWTToken = async (user) => {
	const token = jwt.sign({
			// id: user._id,
			username: user.username,
		},
		process.env.JWT_SECRET, {
			expiresIn: '3600000s', // token will expire in 1000h
		},
	);

	return token;
}

const changeInvitationStatus = (invitation, mode = 'accept') => {
	
	if (!invitation) {
		throw new Error("Invitation update failed: invitation object does not exist")
	}

	// console.log(invitation)
	if (invitation.accepted != -1) {
		throw new Error("Invitation update failed: cannot modify past invitation")
	}

	if (mode === INVITATION_ACTIONS.ACCEPT) {
		invitation.accepted = 1;
	} else if (mode === INVITATION_ACTIONS.DECLINE) {
		invitation.accepted = 0;
	}
}

const addTags = async (newTags, oldTags) => {

	// console.log(newTags, oldTags)

	// deletion process
	if (oldTags && oldTags.length !== 0) {
		await Tag.updateMany({
			name: {
				$in: oldTags,
			}
		}, {
			$inc: {
				count: -1
			}
		});
	}

	// creation process
	const existingTags = await Tag.find({ name: { $in: newTags } });
	// console.log('existingTags', existingTags)

	await Tag.updateMany({
		name: {
			$in: existingTags.map(tag => tag.name),
		}
	}, {
		$inc: {
			count: 1
		}
	});

	// Filter out non-existing tags
	const nonexistingTags = await newTags.filter(tag => !existingTags.map(tag => tag.name).includes(tag));
	// console.log('nonexistingTags', nonexistingTags)


	const insertedTags = nonexistingTags.map(tag => ({ name: tag, count: 1 }));

	const insertedRes = await Tag.insertMany(insertedTags)

	// console.log(insertedRes);

	return newTags;
}

const deleteBullet = async (bullet) => {
	// Decrement all tags
	await addTags([], bullet.tags);
	const deleteRes = await Bullet.deleteOne({ _id: bullet._id });
	if (deleteRes.deletedCount !== 1 || !deleteRes.ok) {
		throw new Error("Bullet deletion failed: an error occurred when deleting the bullet.");
	}
}

module.exports = {
	generateUserModel: ({
		user
	}) => ({}),
	getUser,
	getCurrentUser,
	loadUsersByUsernames,
	loadUsersByUserIds,
	generateJWTToken,
	changeInvitationStatus,
	getCurrentRoom,
	getCurrentResource,
	getCurrentBullet,
	addTags,
	deleteBullet,
	INVITATION_TYPES,
	INVITATION_ACTIONS,
}