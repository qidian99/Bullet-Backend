mutation createBullet {
  createBullet(
    roomId: "5f533cf50ee8ec34c0d0d2b5" 
    source: "Bilibili" 
    timestamp: 12324535 
    content: "BN3"
    resourceId: "5f53ceb533f70d0d08d71891"
  ) {
    ...bulletFragment
  }
}

mutation deleteBullet {
  deleteBullet(bulletId: "5f53cd65bc1d3019cc1c86de") {
    ...bulletFragment
  }
}

mutation updateBullet {
  updateBullet(
    bulletId: "5f53cd65bc1d3019cc1c86de"
    content: "new content"
    tags: "[\"c\",\"d\",\"e\"]"
    resourceId: "5f53cc692f8f6619803bfd94"
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
  allBulletsInResource(roomId: "5f533cf50ee8ec34c0d0d2b5" resourceId: "5f53cc692f8f6619803bfd94") {
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
  resource {
    resourceId
    tags {
      name
      count
    }
    description
    user {
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