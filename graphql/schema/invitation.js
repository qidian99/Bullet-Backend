const { gql } = require('apollo-server');

const typedef = gql`
	type Invitation {
		invitationId: ID!
		user: User!
		room: Room
		accepted: Int!
		sentAt: String!
	}

	extend type Query {
		invitations: [Invitation],
		allRoomInvitations: [Invitation]
	}

	extend type Mutation {
		createRoomInvitation(roomId: ID! userId: ID!): Invitation!
		acceptRoomInvitation(invitationId: ID!): Invitation!
		declineRoomInvitation(invitationId: ID!): Invitation!
	}
`

module.exports = typedef;