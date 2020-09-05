const { gql } = require('apollo-server');

const typedef = gql`
	type Bullet {
		bulletId: ID!
		user: User!
		room: Room
		source: String!
		type: Resource!
		tags: [Tag]
    timestamp: Int!
		content: String!
		updatedAt: String
		createdAt: String
	}

	extend type Query {
		bullets: [Bullet],
		bulletsByUser(roomId: ID source: String type: String userId: ID!): [Bullet]
		allBulletsInRoom(roomId: ID!): [Bullet]
		allBulletsInResource(roomId: ID! type: ID!): [Bullet]
	}

	extend type Mutation {
		createBullet(roomId: ID! type: ID! source: String! timestamp: Int! content: String!): Bullet!
		updateBullet(bulletId: ID! content: String type: ID tags: JSON timestamp: Int): Bullet
		deleteBullet(bulletId: ID!): Bullet
	}
`

module.exports = typedef;