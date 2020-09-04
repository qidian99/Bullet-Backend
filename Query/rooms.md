mutation createRoom2 {
  createRoom(alias: "room3" users:"[\"5f527d952f66cc4ee45fe69d\",\"5f5280191e6a9b244079d96a\"]" admins:"[\"5f5280191e6a9b244079d96a\"]" public:true) {
    ...roomFragment
  }
}

query rooms {
  rooms {
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


query currentUser {
  currentUser {
    userId
    password
    username
  }
}