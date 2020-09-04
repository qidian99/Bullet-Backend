const { gql } = require('apollo-server');

const typedef = gql`
	type Room {
		roomId: ID!
		alias: String!
    users: [User]!
    admins: [User]!
    pending: [User]!
    public: Boolean
	}

	extend type Query {
		rooms: [Room],
		room(room: ID!): Room
	}

	extend type Mutation {
		createRoom(alias: String! users: Array! admins: Array! public: Boolean ): Room!
	}
`

module.exports = typedef;