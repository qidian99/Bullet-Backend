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
const {
	INVITATION_TYPES,
	INVITATION_ACTIONS
} = require('../../util/types');


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
		deleteFriend: async (parent, {
			userId
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			// console.log(currentUser.friends);

			if (!currentUser.friends.includes(ObjectId(userId))) {
				throw new Error("Friend deletion failed: you guys are not friends in the first place");
			}

			const oldFriend = await User.findById(userId);

			// console.log(oldFriend.friends.filter((id) => {
			// 	return id.toString() !== currentUser._id.toString()
			// }));

			oldFriend.friends = oldFriend.friends.filter((id) => id.toString() !== currentUser._id.toString())
			oldFriend.save();
			currentUser.friends = currentUser.friends.filter((id) => id.toString() !== oldFriend._id.toString())
			currentUser.save();

			const inv = await FriendInvitation.update({
				$or: [{
						from: currentUser._id,
						to: oldFriend._id,
						accepted: 1,
					},
					{
						from: oldFriend._id,
						to: currentUser._id,
						accepted: 1,
					}
				]
			}, {
				accepted: -2,
			}, {
				multi: true
			});;

			// console.log(inv);
			// should be { n: 1, nModified: 1, ok: 1 }
			return oldFriend;

		},
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
			if (!currentUser.friends) {
				currentUser.friends = []
			}
			fromUser.friends.push(currentUser._id);
			fromUser.save();
			currentUser.friends.push(fromUser._id);
			currentUser.save();
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
				throw new Error("Friend additon failed: You are sending friend request to a black hole\.")
			}

			// Check if a friend invitation has already been sent
			const inv = await FriendInvitation.findOne({
				from: currentUser._id,
				to: toUser._id,
				accepted: {
					$in: [1, -1],
				}
			});

			if (inv) {
				throw new Error("Either you are already friend with the user, or you have an ongoing friend request.")
			}

			const invitation = await new FriendInvitation({
				from: currentUser._id,
				to: toUser._id,
				accepted: -1,
			}).save();

			return invitation;
		},
		addFriendWithoutInvitation: async (parent, {
			to,
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);
			// Check if user in the room
			const toUser = await User.findById(to);
			if (!toUser) {
				throw new Error("Friend additon failed: You are sending friend request to a black hole\.")
			}

			// Check if a friend invitation has already been sent
			const inv = await FriendInvitation.findOne({
				from: currentUser._id,
				to: toUser._id,
				accepted: {
					$in: [1, -1],
				}
			});

			if (inv) {
				throw new Error("Either you are already friend with the user, or you have an ongoing friend request.")
			}

			const invitation = await new FriendInvitation({
				from: currentUser._id,
				to: toUser._id,
				accepted: 1,
			}).save();

			// Manually push to each other's friend list
			if (!currentUser.friends) currentUser.friends = [];
			if (!toUser.friends) toUser.friends = [];
			currentUser.friends.push(toUser._id);
			currentUser.save();
			toUser.friends.push(currentUser._id);
			toUser.save();

			return invitation;
		},
	},
	Query: {
		allFriendInvitations: async () => {
			return FriendInvitation.find({}, null, {
				sort: {
					updatedAt: -1,
				}
			});
		},
		friendInvitations: async (parent, {
			history
		}, {
			user
		}) => {
			const currentUser = await getCurrentUser(user);

			const query = {
				to: currentUser._id,
			}
			if (history !== true) {
				query.accepted = -1;
			}

			const invitations = await FriendInvitation.find(query, null, {
				sort: {
					updatedAt: -1
				}
			})
			return invitations;
		}
	}
}