const { gql } = require('apollo-server');

const typedef = gql`
	type User {
		userId: ID!
		username: String!
		password: String
	}

	type LoginResponse {
		user: User!
		token: String!
	}

	input UserInput {
		username: String!
		password: String
	}

	extend type Query {
		users: [User],
		user(userId: ID!): User!
		currentUser: User
		verifyToken(token: String!): User!
	}

	extend type Mutation {
		createUser(username: String! password: String!): User!
		login(input: UserInput!): LoginResponse!
		delete(username: String!): User!
	}
`

module.exports = typedef;