mutation createRoom {
  createRoom(alias: "room6" users:"[\"5f52bc83e3221e1950a55fd6\",\"5f52bc89e3221e1950a55fd7\",\"5f52bc8de3221e1950a55fd8\"]" admins:"[\"5f52bc83e3221e1950a55fd6\"]" public:true) {
    ...roomFragment
  }
}

mutation deleteRoom {
	deleteRoom(roomId: "5f52fec86cac725224886fbc") {
    ...roomFragment
  }
}

mutation updateRoom {
  updateRoom(
    roomId: "5f52bd529a1f761f8c44eae3" 
    alias: "room6" 
    # users:"[\"5f52bc83e3221e1950a55fd6\",\"5f52bc89e3221e1950a55fd7\",\"5f52bc8de3221e1950a55fd8\"]" 
    # admins:"[\"5f52bc83e3221e1950a55fd6\"]" 
    public: false
  ) {
    ...roomFragment
  }
}

query rooms {
  rooms {
    ...roomFragment
  }
}

query room {
  room(roomId: "5f52bd529a1f761f8c44eae3") {
    ...roomFragment
  }
}

fragment roomFragment on Room {
  roomId
  alias
  creator {
    userId
    username
  }
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
  public
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


query aggregateBulletsInRoom {
  aggregateBulletsInRoom(roomId: "5f52bd529a1f761f8c44eae3") {
  	source
    bullets {
      ...bulletFragment
    }
  }
}

fragment bulletFragment on Bullet {
  bulletId
  user {
    userId
    username
  }
  room {
    roomId
    alias
  }
  timestamp
  content
  updatedAt
	createdAt
  tags {
    name
    count
  }
}