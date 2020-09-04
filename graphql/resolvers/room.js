const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = mongoose.model('User');
const { getUser, getCurrentUser } = require('../../util');
const { ObjectId } = require('mongodb');


module.exports = {
	Room: {	
		users: async(parent) => {
			const ids = parent.map(id => ObjectId(id));
			return User.find({ _id: ids });
		},
		admins: async(parent) => {
			const ids = parent.map(id => ObjectId(id));
			return User.find({ _id: ids });
		}
	},
	Mutation: {
		createRoom: async(parent, { alias, users, admins, public }, { user }) => {
			const currentUser = await getCurrentUser(user);
			console.log('current user', currentUser);

			const room = await new Room({
				alias,
				users: [currentUser],
				admins: admins,
				pending: users.filter((username => username !== currentUser.username)),
				public,
			}).save();

			return room;
		},
		login: async(parent, { username, password }, info) => {
			const user = await User.findOne({ username });

		
			if (!user) {
				throw new Error('User does not exist');
			}
		
			const passwordMatch = await bcrypt.compare(password, user.password)
		
			if (!passwordMatch) {
				throw new Error('Incorrect password');
			}
		
			const token = jwt.sign(
				{
					id: user.id,
					username: user.username,
				},
				process.env.JWT_SECRET,
				{
					expiresIn: '3600s', // token will expire in 1h
				},
			)
			return {
				token,
				user,
			}
		}
	},
	Query: {
		user: async(parent, { userId }) => {
			return await User.findById(userId);
		},
		currentUser: async(parent, args, { user }) => {
			// this if statement is our authentication check
			if (!user) {
				throw new Error('Not Authenticated.');
			}
			return User.findOne({ username: user.username });
		},
		users: async(parent) => {
			return await User.find({});
		},
		verifyToken: async(parent, { token }) => {
			const user = getUser(token)
			if (!user) {
				throw new Error("Invalid token.");
			}
			console.log(user);
			// { 
			// 	id: '5e00dd20c842b116924ecfdc',
  		// 	pid: 'A14581615',
  		// 	iat: 1577114969,
			// 	exp: 1577201369 --- in seconds
			// }
			return User.findOne({ username: user.username });
		}
	}
}