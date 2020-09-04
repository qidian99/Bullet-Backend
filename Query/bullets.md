mutation createBullet {
  createBullet(roomId: "5f52b87b99581d573cbe0382" timestamp: 12324532 content: "my bullet 4") {
    user {
      userId
      username
    }
    room {
      roomId
      alias
    }
    bulletId
    content
    timestamp
  }
}


query bullets {
  bullets {
    ...bulletFragment
  }
}


query allBulletsInRoom {
  allBulletsInRoom(roomId: "5f52b217d9cc4831fc762fad") {
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
    timestamp
    content
}