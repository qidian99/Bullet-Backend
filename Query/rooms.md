mutation createRoom {
  createRoom(alias: "room" users:"[\"peerless07\",2]" admins:"[\"peerless07\",2,3]" public:false) {
    roomId
    alias
  
  }
}

mutation createRoom2 {
  createRoom(alias: "room" users:"[\"5f527d952f66cc4ee45fe69d\",\"5f5280191e6a9b244079d96a\"]" admins:"[\"5f5280191e6a9b244079d96a\"]" public:true) {
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
