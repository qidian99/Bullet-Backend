const mongoose = require('mongoose');

const User = mongoose.model('User');

const jwt = require('jsonwebtoken');

const getUser = token => {
  try {
    if (token) {
      return jwt.verify(token, 'my-secret-from-env-file-in-prod')
    }
    return null
  } catch (err) {
    return null
  }
};

module.exports = {
	generateUserModel: ({ user }) => ({
		getAll: async () => {
			/* fetching/transform logic for all users */
			if(!user || !user.roles.includes('admin')) return null;
			return await User.find({});
		},
		getById: (id) => { /* fetching/transform logic for a single user */ },
		getByGroupId: (id) => { /* fetching/transform logic for a group of users */ },
	 }),
	 getUser,
}