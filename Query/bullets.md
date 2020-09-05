mutation createBullet {
  createBullet(
    roomId: "5f533cf50ee8ec34c0d0d2b5" 
    source: "Bilibili" 
    timestamp: 12324535 
    content: "bilibili 5"
    type: "5f53bc29f3f8511cfc221ba9"
  ) {
    ...bulletFragment
  }
}

mutation deleteBullet {
  deleteBullet(bulletId: "5f53beada657425e182fd435") {
    ...bulletFragment
  }
}

mutation updateBullet {
  updateBullet(
    bulletId: "5f53beada657425e182fd435"
    content: "new content"
    tags: "[\"c\",\"d\",\"e\"]"
    type: "5f53bc29f3f8511cfc221ba1"
  ) {
    ...bulletFragment
  }
}


query bullets {
  bullets {
    ...bulletFragment
  }
}


query allBulletsInRoom {
  allBulletsInRoom(roomId: "5f533cf50ee8ec34c0d0d2b5") {
      ...bulletFragment
  }
}


query allBulletsInResource {
  allBulletsInResource(roomId: "5f533cf50ee8ec34c0d0d2b5" type: "5f53bc29f3f8511cfc221ba9") {
      ...bulletFragment
  }
}


query bulletsByUser {
  bulletsByUser(
    userId: "5f52bc8de3221e1950a55fd8" 
    roomId: "5f52bd529a1f761f8c44eae3"
    source: "Bilibili"
  ) {
    ...bulletFragment
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
  type {
    resourceId
    tags {
      name
      count
    }
    description
    creator {
      username
    }
  }
  source
  timestamp
  content
  updatedAt
	createdAt
  tags {
    name
    count
  }
}