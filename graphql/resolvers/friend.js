const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
const Room = mongoose.model('Room');
const Bullet = mongoose.model('Bullet');
const FriendInvitation = mongoose.model('FriendInvitation');

const {
	getUser,
	getCurrentUser,
	loadUsersByUsernames,
	loadUsersByUserIds,
	changeInvitationStatus,
	getCurrentRoom
} = require('../../util');
const {
	ObjectId
} = require('mongodb');
const bullet = require('../../models/bullet');
const {
	find
} = require('../../models/bullet');
const { INVITATION_TYPES, INVITATION_ACTIONS } = require('../../util/types');


module.exports = {
	FriendInvitation: {
		invitationId: (parent) => parent._id,
		from: (parent) => {
			return User.findById(parent.from);
		},
		to: (parent) => {
			return User.findById(parent.to);
		},
		sentAt: (parent) => parent.createdAt,
	},
	Mutation: {
		acceptFriendInvitation: async (parent, {
			invitationId,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const invitation = await FriendInvitation.findOne({
				_id: invitationId,
				to: currentUser._id,
			});
			changeInvitationStatus(invitation, INVITATION_ACTIONS.ACCEPT)

			// Add the user to the room's user list
			const fromUser = await User.findById(invitation.from);
			if (!fromUser.friends) {
				fromUser.friends = []
			}
			fromUser.friends.push(currentUser._id);
			fromUser.save();
			invitation.save();
			return invitation;
		},

		declineFriendInvitation: async (parent, {
			invitationId,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const invitation = await FriendInvitation.findOne({
				_id: invitationId,
				to: currentUser._id,
			});
			changeInvitationStatus(invitation, INVITATION_ACTIONS.DECLINE)
			invitation.save();
			return invitation;
		},

		createFriendInvitation: async (parent, {
			to,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			// Check if user in the room
			const toUser = await User.findById(to);
			if (!toUser) {
				throw new Error("You are sending friend request to a black hole.")
			}

			const invitation = await new FriendInvitation({
				from: currentUser._id,
				to: toUser._id,
				accepted: -1,
			}).save();

			return invitation;
		},
	},
	Query: {
		friendInvitations: async (parent, _, { user }) => {
			const currentUser = await getCurrentUser(user);

			const invitations = await FriendInvitation.find({ 
				to: currentUser._id,
			})
			return invitations;
		}
	}
}