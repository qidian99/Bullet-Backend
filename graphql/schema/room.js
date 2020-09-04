const { gql } = require('apollo-server');

const typedef = gql`
	type Room {
		roomId: ID!
		alias: String!
    users: [User]!
    admins: [User]!
    pending: [User]!
    public: Boolean
    widgets: [String]
	}

	extend type Query {
		rooms: [Room],
		allRooms: [Room],
    room(room: ID!): Room
	}

	extend type Mutation {
		createRoom(alias: String! users: JSON! admins: JSON! public: Boolean ): Room!
	}
`

module.exports = typedef;