const {
	gql
} = require('apollo-server');

const typedef = gql `
	type Room {
		roomId: ID!
		alias: String!
    users: [User]!
    admins: [User]!
		pending: [User]!
		creator: User!
    public: Boolean
		widgets: [String]
		avatar: String
		updatedAt: String
	}

	type ResourceResponse {
		resource: Resource
		bullets: [Bullet]
		updatedAt: String!
	}

	extend type Query {
		rooms: [Room],
		allRooms(userId: ID): [Room],
		room(roomId: ID!): Room
		resourceTeasersInRoom(roomId: ID! limit: Int): [ResourceResponse]
	}

	extend type Mutation {
		createRoom(alias: String! users: JSON! admins: JSON! public: Boolean avatar: String widgets: JSON ): Room!
		createRoomWithoutInvitation(alias: String! users: JSON! admins: JSON! public: Boolean avatar: String widgets: JSON ): Room!
		updateRoom(roomId: ID! alias: String admins: JSON users: JSON public: Boolean avatar: String widgets: JSON): Room
		deleteRoom(roomId: ID!): Room
	}
`

module.exports = typedef;