const userResolver = require('./user');
const roomResolver = require('./room');
const bulletResolver = require('./bullet');
const invitationResolver = require('./invitation');
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
	invitationResolver,
]