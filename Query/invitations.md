mutation createInvitation {
  createRoomInvitation(roomId: "5f52b87b99581d573cbe0382" userId: "5f52b6e0d0469e0470a2b65f") {
    ...invitationFragment
  }
}


mutation acceptRoomInvitation {
  acceptRoomInvitation(invitationId: "5f52bd529a1f761f8c44eae4") {
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

