const { gql } = require('apollo-server');

const typedef = gql`
	type Bullet {
		bulletId: ID!
		user: User!
		room: Room
    timestamp: Int!
    content: String!
	}

	extend type Query {
		bullets: [Bullet],
		bulletsByUser(userId: ID!): [Bullet]
		allBulletsInRoom(roomId: ID!): [Bullet]
	}

	extend type Mutation {
		createBullet(roomId: ID! timestamp: Int! content: String!): Bullet!
	}
`

module.exports = typedef;