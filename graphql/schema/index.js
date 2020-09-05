const { gql } = require('apollo-server');
const userSchema = require('./user');
const roomSchema = require('./room');
const bulletSchema = require('./bullet');
const roomInvitationSchema = require('./invitation');
const friendInvitationSchema = require('./friend');
const tagSchema = require('./tag');
const resourceSchema = require('./resource');

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
	roomInvitationSchema,
	friendInvitationSchema,
	tagSchema,
	resourceSchema,
];