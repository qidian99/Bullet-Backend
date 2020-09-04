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

const getCurrentUser = async (user) => {
	const userObj = await User.find({ username: user.username })
	if (!userObj) {
		throw new Error("Invalid user in session: User does not exist");
	}
	return userObj;
};

module.exports = {
	generateUserModel: ({ user }) => ({
	}),
	getUser,
	getCurrentUser,
}