mutation createRoom {
  createRoom(alias: "room" users:"[\"peerless07\",2]" admins:"[\"peerless07\",2,3]" public:false) {
    roomId
    alias
  
  }
}
mutation createRoom2 {
  createRoom(alias: "room2" users:"[\"5f527d952f66cc4ee45fe69d\",\"5f5280191e6a9b244079d96a\"]" admins:"[\"5f5280191e6a9b244079d96a\"]" public:true) {
    ...roomFragment
  }
}

query rooms {
  rooms {
    ...roomFragment
  }
}


query findRoomInvitations {
  findRoomInvitations {
 		...roomFragment
  }
}

fragment roomFragment on Room {
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