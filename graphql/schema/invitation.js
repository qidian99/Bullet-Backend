const {
	gql
} = require('apollo-server');

const typedef = gql `
	type RoomInvitation {
		invitationId: ID!
		user: User!
		room: Room
		accepted: Int!
		sentAt: String!
	}

	extend type Query {
		invitations: [RoomInvitation]
		roomInvitations(history: Boolean): [RoomInvitation]
	}

	extend type Mutation {
		createRoomInvitation(roomId: ID! userId: ID!): RoomInvitation!
		acceptRoomInvitation(invitationId: ID!): RoomInvitation!
		declineRoomInvitation(invitationId: ID!): RoomInvitation!
	}
`

module.exports = typedef;