const { gql } = require('apollo-server');

const typedef = gql`
	type Tag {
		tagId: ID!
		name: String!
		count: Int!
	}

	extend type Query {
		tags: [Tag],
		searchTagByName(name: String): [Tag]
	}
`

module.exports = typedef;