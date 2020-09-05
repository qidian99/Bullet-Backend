query Users {
  users {
    ...userFragment
  }
}

query User {
  user(username: "peerless07") {
    ...userFragment
  }
}


query currentUser {
  currentUser {
    ...userSmallFragment
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

mutation updateUser {
  updateUser(
    email: "qidian@ss.om" 
    firstname: "Dian" 
    lastname: "Qi"
    avatar: "ahah"
  ) {
    ...userFragment
  }
}

query findUser {
	findUser(username: "peer") {
    ...userSearchFragment
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


fragment userSearchFragment on UserSearchResponse {
	userId
  username
  password
  email
  firstname
  lastname
  avatar
  pending
  isFriend
}

fragment userFragment on User {
  userId
  password
  username
  email
  avatar
  friends {
    userId
    email
    username
  }
}

fragment userSmallFragment on User {
  userId
  password
  username
  email
  avatar
}