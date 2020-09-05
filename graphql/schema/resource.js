const {
	gql
} = require('apollo-server');

const typedef = gql `
	type Resource {
		resourceId: ID!
		name: String
		room: Room!
		url: String
		description: String
		tags: [Tag]
		user: User!
		updatedAt: String
		createdAt: String
		hidden: Boolean
	}

	extend type Query {
		resources: [Resource]
		resource(resourceId: ID!): Resource
		findResources(userId: ID roomId: ID): [Resource]
	}

	extend type Mutation {
		createResource(roomId: ID! name: String! description: String url: String tags: JSON): Resource!
		updateResource(resourceId: ID! name: String description: String url: String tags: JSON): Resource
		deleteResource(resourceId: ID!): Resource
	}
`

module.exports = typedef;
