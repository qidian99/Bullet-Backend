mutation deleteFriend {
  deleteFriend(userId: "5f52bc8de3221e1950a55fd8") {
    userId
    username
  }
}

mutation createFriendInvitation {
  createFriendInvitation(to: "5f52bc83e3221e1950a55fd6") {
    ...friendInvitationFragment
  }
}


mutation acceptFriendInvitation {
  acceptFriendInvitation(invitationId: "5f52fb655db3da5e58cab0ea") {
		...friendInvitationFragment
  }
}



mutation declineRoomInvitation {
  declineFriendInvitation(invitationId: "5f52a9181594e238b04bb736") {
    ...friendInvitationFragment
  }
}


query allFriendInvitations {
  allFriendInvitations {
    ...friendInvitationFragment
  }
}


query friendInvitations {
  friendInvitations {
    ...friendInvitationFragment
  }
}

fragment friendInvitationFragment on FriendInvitation {
  invitationId
  from {
    username
    email
  }
  to {
    username
    email
  }
  sentAt
  accepted
}

