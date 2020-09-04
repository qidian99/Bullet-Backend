mutation createBullet {
  createBullet(roomId: "5f52bd529a1f761f8c44eae3" source: "Bilibili" timestamp: 12324532 content: "my bullet 4") {
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
  bulletsByUser(userId: "5f52afa73eb6fa08fcd3692a") {
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
}