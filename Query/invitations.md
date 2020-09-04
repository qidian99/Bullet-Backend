mutation createInvitation {
  createRoomInvitation(roomId: "5f529977baa41a24cc4c236f" userId: "5f5263b9b76e96366c4b3c74") {
    ...invitationFragment
  }
}


mutation acceptRoomInvitation {
  acceptRoomInvitation(invitationId: "5f52a5c8b236b45a9011fbeb") {
		...invitationFragment
  }
}



mutation declineRoomInvitation {
  declineRoomInvitation(invitationId: "5f52a9181594e238b04bb736") {
    ...invitationFragment
  }
}


query allRoomInvitations {
  allRoomInvitations {
 		...invitationFragment
  }
}

fragment invitationFragment on Invitation {
  invitationId
  user {
    username
    email
  }
  room {
    roomId
    alias
  }
  sentAt
  accepted
}

