mutation createRoom {
  createRoom(alias: "room" users:"[\"peerless07\",2]" admins:"[\"peerless07\",2,3]" public:false) {
    roomId
    alias
  
  }
}

query rooms {
  rooms {
    roomId
    alias
    users {
      userId
      username
    }
    admins {
      userId
      username
    }
  	pending {
      userId
      username
    }
  }
}