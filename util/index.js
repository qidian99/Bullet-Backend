const mongoose = require('mongoose');

const User = mongoose.model('User');

const jwt = require('jsonwebtoken');

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

module.exports = {
	generateUserModel: ({ user }) => ({
	}),
	getUser,
}