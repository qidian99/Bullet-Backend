const { gql } = require('apollo-server');

const typedef = gql`
	type User {
		userId: ID!
		pid: String!
		password: String
	}

	type LoginResponse {
		user: User!
		token: String!
	}

	input UserInput {
		pid: String!
		password: String
	}

	extend type Query {
		users: [User],
		user(userId: ID!): User!
		currentUser: User
		getUserByPid(pid: String!): User!
		verifyToken(token: String!): User!
	}

	extend type Mutation {
		createUser(input: UserInput!): User!
		login(input: UserInput!): LoginResponse!
		delete(pid: String!): User!
	}
`

module.exports = typedef;