mutation createBullet {
  createBullet(room: "5f5284340d379d2e184cad78" timestamp: 12324532 content: "my bullet") {
    user {
      userId
      username
    }
    bulletId
    content
    timestamp
  }
}