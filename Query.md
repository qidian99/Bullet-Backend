## Users

```
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
```

## Rooms

```
mutation createRoom {
  createRoom(alias: "room" users:"[1,2,3]" admins:"[1,2,3]" public:false) {
    roomId
    alias
    users {
  		userId
      username
  	}
    admins {
  		userId
      username
  	}
  }
}
```