const { gql } = require('apollo-server');

const typedef = gql`
	type Resource {
		resourceId: ID!
		room: Room!
		description: String
		tags: [Tag]
		creator: User!
		updatedAt: String
		createdAt: String
	}

	extend type Query {
		resources: [Resource]
		resource(resourceId: ID!): Resource
		findResources(userId: ID! roomId: ID): [Resource]
	}

	extend type Mutation {
		createResource(roomId: ID! description: String tags: JSON): Resource!
		updateResource(resourceId: ID! description: String tags: JSON): Resource
		deleteResource(resourceId: ID!): Resource
	}
`

module.exports = typedef;