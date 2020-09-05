mutation createInvitation {
  createRoomInvitation(roomId: "5f52b87b99581d573cbe0382" userId: "5f52b6e0d0469e0470a2b65f") {
    ...invitationFragment
  }
}


mutation acceptRoomInvitation {
  acceptRoomInvitation(invitationId: "5f533cf50ee8ec34c0d0d2b6") {
		...invitationFragment
  }
}



mutation declineRoomInvitation {
  declineRoomInvitation(invitationId: "5f52a9181594e238b04bb736") {
    ...invitationFragment
  }
}


query roomInvitations {
  roomInvitations {
 		...invitationFragment
  }
}

query roomInvitationsWithHistory {
  roomInvitations(history: true) {
 		...invitationFragment
  }
}

fragment invitationFragment on RoomInvitation {
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

