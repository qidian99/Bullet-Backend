mutation deleteFriend {
  deleteFriend(userId: "5f533a20873c383d503403ae") {
    userId
    username
  }
}

mutation createFriendInvitation {
  createFriendInvitation(to: "5f533a1a873c383d503403ad") {
    ...friendInvitationFragment
  }
}


mutation acceptFriendInvitation {
  acceptFriendInvitation(invitationId: "5f533eb39f8f305ee4e15f77") {
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

