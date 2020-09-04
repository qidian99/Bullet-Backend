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

mutation login {
  login(username: "peerless07" password: "123456") {
    token
  }
}

mutation createUser {
	createUser(username: "peerless07" password: "123456")  {
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