const userResolver = require('./user');
const roomResolver = require('./room');
const bulletResolver = require('./bullet');
const roomInvitationResolver = require('./invitation');
const friendInvitationResolver = require('./friend');
const tagResolver = require('./tag');
const resourceResolver = require('./resource');
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');

const jsonResolvers = {
	JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
}

module.exports = [
	jsonResolvers,
	userResolver,
	roomResolver,
	bulletResolver,
	roomInvitationResolver,
	friendInvitationResolver,
	tagResolver,
	resourceResolver,
]