const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = mongoose.model('User');
const Joi = require('joi');

const { getUser } = require('../../util');

const userInputSchema = Joi.object().keys({ 
  pid: Joi.string().regex(/^[Aa]\d*$/).required(),
  password: Joi.string().optional(), 
}); 


module.exports = {
	User: {	
		userId: async(parent) => parent._id,
	},
	Mutation: {
		delete: async(parent, { pid }, info) => {
			const user = await User.findOneAndDelete({ pid });
			if (!user) {
				throw new Error("User does not exist.");
			}
			return user;
		},
		createUser: async(parent, args) => {
			const { input } = args;

			await Joi.validate(input, userInputSchema);

			const { pid, password } = input;

			const hashedPassword = await bcrypt.hash(password, 12);
			// if (!pid.match('/Aa\d*/g')) {
			// 	throw new Error('Invalid pid format: ' + pid);
			// }
			
			const user = await User.findOne({ pid });
			if(user){
				throw new Error('Dulplicate pid');
			}

			const newUser = await new User({
				pid,
				password: hashedPassword,
			}).save();
			
			return newUser;
		},
		login: async(parent, { input: { pid, password } }, info) => {
			const user = await User.findOne({ pid });

			console.log('sss', user);
		
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
					pid: user.pid,
				},
				'my-secret-from-env-file-in-prod',
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
		getUserByPid: async(parent, { pid }) =>  {
			return await User.findOne({ pid });
		},
		user: async(parent, { userId }) => {
			return await User.findById(userId);
		},
		currentUser: async(parent, args, { user }) => {
			// this if statement is our authentication check
			if (!user) {
				throw new Error('Not Authenticated.');
			}
			return User.findOne({ pid: user.pid });
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
			return User.findOne({ pid: user.pid });
		}
	}
}