const { gql } = require('apollo-server');
const userSchema = require('./user');
const roomSchema = require('./room');
const bulletSchema = require('./bullet');
const invitationSchema = require('./invitation');

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
	bulletSchema,
	invitationSchema,
];