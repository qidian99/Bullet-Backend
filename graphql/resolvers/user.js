const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = mongoose.model('User');
const Joi = require('joi');

const { getUser } = require('../../util');

const userInputSchema = Joi.object().keys({ 
  username: Joi.string().required(),
  password: Joi.string().required(), 
}); 


module.exports = {
	User: {	
		userId: async(parent) => parent._id,
	},
	Mutation: {
		delete: async(parent, { username }, info) => {
			const user = await User.findOneAndDelete({ username });
			if (!user) {
				throw new Error("User does not exist.");
			}
			return user;
		},
		createUser: async(parent, args) => {
			const { username, password } = args;
			console.log('sss', username);

			const hashedPassword = await bcrypt.hash(password, 12);
			
			const user = await User.findOne({ username });
			
			if(user){
				throw new Error('Dulplicate username');
			}

			const newUser = await new User({
				username,
				password: hashedPassword,
			}).save();

			return newUser;
		},
		login: async(parent, { username, password }, info) => {
			const user = await User.findOne({ username });

		
			if (!user) {
				throw new Error('User does not exist');
			}
		
			const passwordMatch = await bcrypt.compare(password, user.password)
		
			console.log('sbbbbb',	process.env.JWT_SECRET)
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