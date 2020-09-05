const { gql } = require('apollo-server');

const typedef = gql`
	type Bullet {
		bulletId: ID!
		user: User!
		room: Room
		source: String!
		type: String
		tags: JSON
    timestamp: Int!
		content: String!
		updatedAt: String
		createdAt: String
	}

	extend type Query {
		bullets: [Bullet],
		bulletsByUser(roomId: ID type: String userId: ID!): [Bullet]
		allBulletsInRoom(roomId: ID!): [Bullet]
	}

	extend type Mutation {
		createBullet(roomId: ID! source: String! timestamp: Int! content: String!): Bullet!
		deleteBullet(bulletId: ID!): Bullet
	}
`

module.exports = typedef;