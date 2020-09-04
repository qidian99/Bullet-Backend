# Write your query or mutation here
query Users {
  users {
    userId
    password
  }
}

query currentUser {
  currentUser {
    userId
    password
    username
  }
}

mutation loginPeerless07 {
  login(username: "peerless07" password: "123456") {
    token
  }
}

mutation createUserPeerless07 {
	createUser(username: "peerless07" password: "123456")  {
    user {
      ...userProfile
    }
    token
  }
}

mutation loginQidian {
  login(username: "qidian" password: "qidian") {
    token
  }
}

mutation createUserQidian {
	createUser(username: "qidian" password: "qidian")  {
    user {
      ...userProfile
    }
    token
  }
}


mutation loginQidian2 {
  login(username: "qidian2" password: "qidian") {
    token
  }
}

mutation createUserQidian2 {
	createUser(username: "qidian2" password: "qidian")  {
    user {
      ...userProfile
    }
    token
  }
}


mutation createUserWithProfile {
	createUser(username: "qidian2" password: "123456" email: "qidian@qidian.com" firstname: "Dian" lastname: "Qi")  {
    user {
      ...userProfile
    }
    token
  }
}


fragment userProfile on User {
	userId
  username
  password
  email
  firstname
  lastname
  avatar
}