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
		avatar: String
		updatedAt: String
	}

	extend type Query {
		rooms: [Room],
		allRooms(userId: ID): [Room],
		room(room: ID!): Room
	}

	extend type Mutation {
		createRoom(alias: String! users: JSON! admins: JSON! public: Boolean ): Room!
	}
`

module.exports = typedef;