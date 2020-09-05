mutation createRoomWithoutInvitation {
  createRoomWithoutInvitation(alias: "roomNiubi" users:"[\"5f533a1a873c383d503403ad\",\"5f533a24873c383d503403af\"]" admins:"[\"5f533a24873c383d503403af\"]" public:true) {
    ...roomFragment
  }
}

mutation createRoom {
  createRoom(alias: "room1" users:"[\"5f533a1a873c383d503403ad\",\"5f533a24873c383d503403af\"]" admins:"[\"5f533a24873c383d503403af\"]" public:true) {
    ...roomFragment
  }
}

mutation deleteRoom {
	deleteRoom(roomId: "5f533c810ee8ec34c0d0d2b2") {
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
  aggregateBulletsInRoom(roomId: "5f533cf50ee8ec34c0d0d2b5") {
  	resource {
      ...resourceFragment
    }
    bullets {
      ...bulletFragment
    }
    updatedAt
  }
}

query resourceTeasersInRoom {
  resourceTeasersInRoom(roomId: "5f533cf50ee8ec34c0d0d2b5") {
  	resource {
      ...resourceFragment
    }
    bullets {
      ...bulletFragment
    }
    updatedAt
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



fragment resourceFragment on Resource {
  resourceId
  room {
    roomId
    alias
  }
  name
  description
  url
  tags {
    name
    count
  }
  user {
    userId
    username
  }
  updatedAt
	createdAt
}