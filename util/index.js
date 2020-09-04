const mongoose = require('mongoose');

const User = mongoose.model('User');

const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

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

	const ERR_STR = "Invalid user in session: User does not exist";
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

const loadUsersByUsernames = async (usernames) => {
	const users = await User.find({
		username: {
			$in: usernames
		}
	});
	// console.log('loadUsersByUsernames', users);
	if (!users) {
		throw new Error("Invalid usernames");
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
		throw new Error("Invalid user ids");
	}
	return users;
};

const generateJWTToken = async (user) => {
	const token = jwt.sign({
			id: user._id,
			username: user.username,
		},
		process.env.JWT_SECRET, {
			expiresIn: '36000s', // token will expire in 1h
		},
	);

	return token;
}

const changeInvitationStatus = (invitation, mode = 'accept') => {
	
	if (!invitation) {
		throw new Error("Room invitation does not exist")
	}

	// console.log(invitation)
	if (invitation.accepted != -1) {
		throw new Error("Cannot modify past invitation")
	}

	if (mode === 'accept') {
		invitation.accepted = 1;
	} else if (mode === 'decline') {
		invitation.accepted = 0;
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
}