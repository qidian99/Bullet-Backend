const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = mongoose.model('User');
const Joi = require('joi');

const {
	getUser,
	getCurrentUser,
	generateJWTToken
} = require('../../util');
const {
	ObjectId
} = require('mongodb');

const userInputSchema = Joi.object().keys({
	username: Joi.string().required(),
	password: Joi.string().required(),
});


module.exports = {
	User: {
		userId: async (parent) => parent._id,
		friends: async (parent) => {
			// console.log('parent.friends', parent.friends)
			return User.find({
				_id: {
					$in: parent.friends,
				}
			})
		}
	},
	Mutation: {
		delete: async (parent, {
			username
		}, info) => {
			const user = await User.findOneAndDelete({
				username
			});
			if (!user) {
				throw new Error("User deletion failed: user does not exist.");
			}
			return user;
		},
		createUser: async (parent, args) => {
			const {
				username,
				password,
				email,
				firstname,
				lastname,
				avatar
			} = args;
			// console.log('sss', username);

			const hashedPassword = await bcrypt.hash(password, 12);

			const user = await User.findOne({
				username
			});

			if (user) {
				throw new Error('User creation failed: dulplicate username');
			}

			const newUser = await new User({
				username,
				password: hashedPassword,
				firstname,
				lastname,
				email,
				avatar,
				friends: [],
			}).save();

			const token = generateJWTToken(newUser);
			return {
				token,
				user: newUser,
			}
		},
		updateUser: async (parent, args, {
			user: contextUser
		}) => {
			const {
				password,
				email,
				firstname,
				lastname,
				avatar
			} = args;


			const user = await getCurrentUser(contextUser);

			if (password) {
				const hashedPassword = await bcrypt.hash(password, 12);
				user.password = hashedPassword;
			}

			if (email) {
				user.email = email;
			}

			if (firstname) {
				user.firstname = firstname;
			}

			if (lastname) {
				user.lastname = lastname;
			}

			if (avatar) {
				user.avatar = avatar;
			}

			await user.save();

			return user;
		},
		login: async (parent, {
			username,
			password
		}) => {
			const user = await User.findOne({
				username
			});

			if (!user) {
				throw new Error('User login failed: user does not exist');
			}

			const passwordMatch = await bcrypt.compare(password, user.password)

			if (!passwordMatch) {
				throw new Error('User login failed: incorrect password');
			}

			const token = generateJWTToken(user);
			return {
				token,
				user,
			}
		}
	},
	Query: {
		user: async (parent, {
			userId,
			username,
		}) => {
			if (userId) return User.findById(userId);
			if (username) return User.findOne({ username });
			throw new Error("User retrieval failed: neither userId nor username is provided. You are chilling")
		},
		currentUser: async (parent, args, {
			user
		}) => {
			// this if statement is our authentication check
			if (!user) {
				throw new Error('Current user retrieval failed: not Authenticated.');
			}
			return User.findOne({
				username: user.username
			});
		},
		users: async (parent) => {
			return await User.find({});
		},
		findUser: async (parent, {
			username
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);

			const users = await User.aggregate([{
					$match: {
						$and: [{
							$or: [{
								username: {
									$regex: username,
									"$options": 'i',
								}
							}, {
								email: {
									$regex: username,
									"$options": 'i',
								}
							}]
						}, {
							_id: {
								$ne: currentUser._id
							}
						}],
					},
					// Check the pending friend status	
				}, {
					$lookup: {
						from: "friendinvitations",
						localField: "_id",
						foreignField: "to",
						// pipeline: [{
						// 	$match: {
						// 		from: currentUser._id
						// 	}
						// }],
						as: "pending"
					}
				},
				{
					$addFields: {
						isFriend: {
							$cond: {
								if: {
									$in: [currentUser._id, "$friends"]
								},
								then: 1,
								else: 0
							}
						}
					}
				},
				{
					"$project": {
						"userId": "$_id",
						"isFriend": "$isFriend",
						"username": "$username",
						"firstname": "$firstname",
						"lastname": "$lastname",
						"avatar": "$avatar",
						"pending": {
							$filter: {
								input: "$pending",
								as: "p",
								cond: {
									$and: [{
										$eq: ["$$p.from", currentUser._id],
									}, {
										$eq: ["$$p.accepted", -1],
									}],
								}
							}
						}
					}
				},
				{
					$set: {
						pending: {
							$size: "$pending"
						},
					}
				},

				// {
				// 	"$unwind": "$pending"
				// },
				// {
				// 	"$match": {
				// 		"pending.from": currentUser._id
				// 	}
				// },
				// {
				// 	"$group": {
				// 		"_id": "$_id",
				// 		"friends": {
				// 			"$first": "$friends:"
				// 		},
				// 		"username": {
				// 			"$first": "$username"
				// 		},
				// 		"firstname": {
				// 			"$first": "$firstname"
				// 		},
				// 		"lastname": {
				// 			"$first": "$lastname"
				// 		},
				// 		"avatar": {
				// 			"$first": "$avatar"
				// 		},
				// 		"pending": {
				// 			"$push": {
				// 				$filter: {
				// 					input: "$pending",
				// 					as: "p",
				// 					cond: {
				// 						$eq: ["$$p.from", ObjectId(currentUser._id)],
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}
				// }
			])

			// console.log('users', users);
			// users.forEach(u => console.log('u.pending', u.pending))

			return users;

		},
		verifyToken: async (parent, {
			token
		}) => {
			const user = getUser(token)
			if (!user) {
				throw new Error("Token verification failed: invalid token.");
			}
			// console.log(user);
			// { 
			// 	id: '5e00dd20c842b116924ecfdc',
			// 	username: 'qidian',
			// 	iat: 1577114969,
			// 	exp: 1577201369 --- in seconds
			// }
			return User.findOne({
				username: user.username
			});
		},
	}
}