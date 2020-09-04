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
    findRoomInvitations: [Room]
	}

	extend type Mutation {
		createRoom(alias: String! users: JSON! admins: JSON! public: Boolean ): Room!
	}
`

module.exports = typedef;