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
		bulletByUser(user: ID!): [Bullet]
		findAllBulletsInRoom(room: ID!): [Bullet]
	}

	extend type Mutation {
		createBullet(room: ID timestamp: Int! content: String!): Bullet!
	}
`

module.exports = typedef;