mutation createBullet {
  createBullet(room: "5f5284340d379d2e184cad78" timestamp: 12324532 content: "my bullet") {
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


query findAllBulletsInRoom {
  findAllBulletsInRoom(room: "5f5284340d379d2e184cad78") {
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