mutation createBullet {
  createBullet(roomId: "5f52bd529a1f761f8c44eae3" source: "Bilibili" timestamp: 12324532 content: "my bullet 4") {
    ...bulletFragment
  }
}

mutation deleteBullet {
  deleteBullet(bulletId: "5f52c4b95ea2eb174c242881") {
    ...bulletFragment
  }
}

mutation updateBullet {
  updateBullet(
    bulletId: "5f52c7a3e56fc620088d6dfb"
    content: "new content"
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
  allBulletsInRoom(roomId: "5f52bd529a1f761f8c44eae3") {
      ...bulletFragment
  }
}

query bulletsByUser {
  bulletsByUser(userId: "5f52bc8de3221e1950a55fd8" roomId: "5f52bd529a1f761f8c44eae3") {
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
  source
  timestamp
  content
  updatedAt
	createdAt
}