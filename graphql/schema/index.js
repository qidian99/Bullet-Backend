const { gql } = require('apollo-server');
const userSchema = require('./user');
const roomSchema = require('./room');

const rootSchema = gql `
	scalar JSON
	scalar JSONObject

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
	roomSchema,
];