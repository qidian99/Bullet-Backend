mutation createRoom {
  createRoom(alias: "room2" users:"[\"5f52bc83e3221e1950a55fd6\",\"5f52bc89e3221e1950a55fd7\",\"5f52bc8de3221e1950a55fd8\"]" admins:"[\"5f52bc83e3221e1950a55fd6\"]" public:true) {
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
    avatar
    updatedAt
}


query currentUser {
  currentUser {
    userId
    password
    username
  }
}

query allRooms {
  allRooms {
    ...roomFragment
  }
}