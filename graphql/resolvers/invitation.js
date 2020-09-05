const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
const Room = mongoose.model('Room');
const Bullet = mongoose.model('Bullet');
const RoomInvitation = mongoose.model('RoomInvitation');

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
	RoomInvitation: {
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
			const invitation = await RoomInvitation.findOne({
				_id: invitationId,
				userId: currentUser._id,
			});
			changeInvitationStatus(invitation, INVITATION_ACTIONS.ACCEPT)

			// Add the user to the room's user list
			const currentRoom = await getCurrentRoom(invitation.roomId);
			currentRoom.users.push(currentUser._id);
			currentRoom.save();

			await invitation.save();
			return invitation;
		},

		declineRoomInvitation: async (parent, {
			invitationId,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			const RoomInvitation = await RoomInvitation.findOne({
				_id: invitationId,
				userId: currentUser._id,
			});
			changeInvitationStatus(invitation, INVITATION_ACTIONS.DECLINE)
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
				admins: currentUser._id,
				users: currentUser._id,
			});

			if (!room) {
				throw new Error("User is not the admin of the room, so he/she cannot send invitation");
			}

			const invitationUser = await User.findById(userId);

			if (!invitationUser) {
				throw new Error("The invited user does not exist.")
			}


			const invitation = await new RoomInvitation({
				userId: invitationUser._id,
				roomId: room._id,
				accepted: -1,
			}).save();

			return invitation;
		},
	},
	Query: {
		invitations: async (parent) => {
			return await RoomInvitation.find({}, null, {
				sort: {
					updatedAt: -1
				}
			});
		},
		roomInvitations: async (parent, _, { user }) => {
			const currentUser = await getCurrentUser(user);

			const invitations = await RoomInvitation.find({ 
				userId: currentUser._id,
			}, null, {
				sort: {
					updatedAt: -1
				}
			})
			return invitations;
		}
	}
}