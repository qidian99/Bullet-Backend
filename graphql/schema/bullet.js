const {
	gql
} = require('apollo-server');

const typedef = gql `
	type Bullet {
		bulletId: ID!
		user: User!
		room: Room
		source: String!
		resource: Resource!
		tags: [Tag]
		row: Float
    timestamp: Float!
		content: String!
		updatedAt: String
		createdAt: String
	}

	extend type Query {
		bullets: [Bullet],
		bulletsByUser(roomId: ID source: String resourceId: String userId: ID!): [Bullet]
		allBulletsInRoom(roomId: ID!): [Bullet]
		allBulletsInResource(roomId: ID! resourceId: ID!): [Bullet]
	}

	extend type Mutation {
		createBullet(roomId: ID! resourceId: ID! source: String! timestamp: Int! row: Int content: String!): Bullet!
		updateBullet(bulletId: ID! content: String resourceId: ID tags: JSON timestamp: Int row: Int): Bullet
		deleteBullet(bulletId: ID!): Bullet
	}
`

module.exports = typedef;