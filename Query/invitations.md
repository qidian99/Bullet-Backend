mutation createInvitation {
  createRoomInvitation(roomId: "5f529977baa41a24cc4c236f" userId: "5f5263b9b76e96366c4b3c74") {
    invitationId
    user {
      username
      email
    }
    sentAt
    accepted
  }
}


mutation acceptRoomInvitation {
  acceptRoomInvitation(invitationId: "5f52a5c8b236b45a9011fbeb") {
    invitationId
		user {
      username
      email
    }
    sentAt
    accepted
  }
}



mutation declineRoomInvitation {
  declineRoomInvitation(invitationId: "5f52a9181594e238b04bb736") {
    invitationId
		user {
      username
      email
    }
    sentAt
    accepted
  }
}