const {
	gql
} = require('apollo-server');

const typedef = gql `
	type FriendInvitation {
		invitationId: ID!
		from: User!
		to: User!
		accepted: Int!
		sentAt: String!
	}

	extend type Query {
		friendInvitations(history: Boolean): [FriendInvitation]
		allFriendInvitations: [FriendInvitation]
	}

	extend type Mutation {
		createFriendInvitation(to: ID!): FriendInvitation!
		acceptFriendInvitation(invitationId: ID!): FriendInvitation!
		declineFriendInvitation(invitationId: ID!): FriendInvitation!
		deleteFriend(userId: ID!): User
		addFriendWithoutInvitation(to: ID!): FriendInvitation!
	}
`

module.exports = typedef;