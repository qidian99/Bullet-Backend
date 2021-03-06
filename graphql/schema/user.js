const {
	gql
} = require('apollo-server');

const typedef = gql `
	type User {
		userId: ID!
		username: String!
		password: String
		email: String
		firstname: String
		lastname: String
		avatar: String
		friends: [User]
	}

	type LoginResponse {
		user: User!
		token: String!
	}

	
	type UserSearchResponse {
		userId: ID!
		username: String!
		password: String
		email: String
		firstname: String
		lastname: String
		avatar: String
		pending: Int
		isFriend: Int
	}

	input UserInput {
		username: String!
		password: String
	}

	extend type Query {
		users: [User],
		user(userId: ID username: String): User!
		currentUser: User
		verifyToken(token: String!): User!
		findUser(username: String): [UserSearchResponse]
	}

	extend type Mutation {
		createUser(username: String! password: String! email: String firstname: String lastname: String avatar: String): LoginResponse!
		updateUser(password: String email: String firstname: String lastname: String avatar: String): User!
		login(username: String! password: String!): LoginResponse!
		delete(username: String!): User!
	}
`

module.exports = typedef;