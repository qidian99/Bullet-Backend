const { gql } = require('apollo-server');
const userSchema = require('./user');

const rootSchema = gql `
	type Query{
		_:Boolean
	}
	type Mutation{
		_:Boolean
	}
`
module.exports = [
	rootSchema,
	userSchema, 
];