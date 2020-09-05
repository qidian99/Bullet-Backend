mutation createBullet {
  createBullet(
    roomId: "5f52bd529a1f761f8c44eae3" 
    source: "Aiyiqi" 
    timestamp: 12324535 
    content: "3"
  ) {
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
    bulletId: "5f53144d8b093d4b6c72babd"
    content: "new content"
    tags: "[\"c\",\"d\",\"e\"]"
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


query allBulletsInVideo {
  allBulletsInVideo(roomId: "5f52bd529a1f761f8c44eae3" source: "Aiyiqi") {
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