mutation createResource {
  createResource(
    roomId: "5f53b3e4d008084e94c1442c"
    name: "New Resource"
    description: "This is the video source in Room Niubi" 
    url: "http://haha.ha.com"
    tags: "[\"Bilibili\",\"Aiqiyi\"]"
  ) {
    ...resourceFragment
  }
}

mutation deleteResource {
  deleteResource(resourceId: "5f53bb757e8a045230936b09") {
    ...resourceFragment
  }
}

mutation updateResource {
  updateResource(
    resourceId: "5f53bb757e8a045230936b09"
    description: "new content"
    tags: "[\"c\",\"d\",\"e\"]"
  ) {
    ...resourceFragment
  }
}


query resources {
  resources {
    ...resourceFragment
  }
}

query resource {
  resource(resourceId: "5f53bc29f3f8511cfc221ba9") {
    ...resourceFragment
  }
}


query findResources {
  findResources(
    userId: "5f52bc8de3221e1950a55fd8" 
    roomId: "5f52bd529a1f761f8c44eae3"
  ) {
    ...resourceFragment
  }
}




fragment resourceFragment on Resource {
  resourceId
  room {
    roomId
    alias
  }
  name
  description
  url
  tags {
    name
    count
  }
  creator {
    userId
    username
  }
  updatedAt
	createdAt
}