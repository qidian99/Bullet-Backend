const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
const Room = mongoose.model('Room');
const Bullet = mongoose.model('Bullet');
const Invitation = mongoose.model('Invitation');

const {
	getUser,
	getCurrentUser,
	loadUsersByUsernames,
	loadUsersByUserIds,
	changeInvitationStatus
} = require('../../util');
const {
	ObjectId
} = require('mongodb');
const bullet = require('../../models/bullet');
const {
	find
} = require('../../models/bullet');


module.exports = {
	Invitation: {
		invitationId: (parent) => parent._id,
		user: (parent) => {
			return User.findById(parent.userId);
		},
		room: (parent) => {
			return Room.findById(parent.roomId);
		},
		sentAt: (parent) => parent.createdAt,
	},
	Mutation: {
		acceptRoomInvitation: async (parent, {
			invitationId,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const invitation = await Invitation.findOne({
				_id: invitationId,
				userId: currentUser._id,
			});
			changeInvitationStatus(invitation, 'accept')
			await invitation.save();
			return invitation;
		},

		declineRoomInvitation: async (parent, {
			invitationId,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const invitation = await Invitation.findOne({
				_id: invitationId,
				userId: currentUser._id,
			});
			changeInvitationStatus(invitation, 'decline')
			await invitation.save();
			return invitation;
		},

		createRoomInvitation: async (parent, {
			roomId,
			userId,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			// Check if user in the room
			const room = Room.find({
				_id: roomId,
				admins: currentUser._id
			});

			if (!room) {
				throw new Error("User is not the admin of the room, so he/she cannot send invitation");
			}

			const invitationUser = await User.findById(userId);

			if (!invitationUser) {
				throw new Error("The invited user does not exist.")
			}


			const invitation = await new Invitation({
				userId: invitationUser._id,
				roomId: room._id,
				accepted: -1,
			}).save();

			return invitation;
		},
	},
	Query: {
		invitations: async (parent) => {
			return await Invitation.find({});
		},
		allRoomInvitations: async (parent, _, { user }) => {
			const currentUser = await getCurrentUser(user);

			const invitations = await Invitation.find({ userId: currentUser._id })
			return invitations;
		}
	}
}