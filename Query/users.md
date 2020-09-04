# Write your query or mutation here
query Users {
  users {
    userId
    password
  }
}

mutation login {
  login(username: "peerless07" password: "123456") {
    token
  }
}

mutation createUser {
	createUser(username: "peerless07" password: "123456")  {
    userId
    password
  }
}
