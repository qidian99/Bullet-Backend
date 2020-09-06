# Bullet模型补充文档

本文档主要对以下模型进行技术性说明：
1. User：Bullet用户对象
2. Room：房间对象，为用户创建，可公开或私有
3. Bullet：弹幕对象
4. Resource：资源对象
5. Tag：标签对象
6. Invitation：房间邀请
7. Friend：好友邀请

## User用户对象
### 模式定义
```ts
type User {
  userId: ID!
  username: String!
  password: String
  email: String
  firstname: String
  lastname: String
  avatar: String
  friends: [User]
}
```
1. userId：用户唯一标识符
2. username：用户用户名，必填项。MongoDB会建立userId和username的双索引
3. password：用户密码，使用bcrypt用环境变量中的JWT_SECRET进行加密
4. email：邮箱，可选。以后可以同过用户名或密码进行登录
5. avatar、firstname、lastname：用户资料中存储的姓、名、头像
    * 一开始所有图片资源尝试过base64存储在数据库中，特别占据索引
    * 目前前后端统一意见，所有媒体类型只支持URI
    * 使用S3桶或者腾讯对象存储COS进行哈希和存储
6. friends：用户的所有好友，后端存储为用户ID，前端会自动填充为User对象

### API和返回值

#### 注册登录
```ts
createUser(username: String! password: String! email: String firstname: String lastname: String avatar: String): LoginResponse!

login(username: String! password: String!): LoginResponse!
```

返回类型
```ts
type LoginResponse {
  user: User!
  token: String!
}
```
用户成功登录或注册以后的返回结果
1. user为用户对象，可选择性地提取属性(GraphQL特性)
2. token为JWT，前端或插件会保存到对应的localStorage或者chrome.sync.storage中


#### ID查询
```ts
users: [User],
user(userId: ID username: String): User!
currentUser: User
```

#### 更新用户
```ts
updateUser(password: String email: String firstname: String lastname: String avatar: String): User!
```

#### 删除用户
```ts
delete(username: String!): User!
```

#### 用户检索
```ts
findUser(username: String): [UserSearchResponse]
```
返回类型

```ts
type UserSearchResponse {
  userId: ID!
  username: String!
  password: String
  email: String
  firstname: String
  lastname: String
  avatar: String
  pending: Int
  isFriend: Int
}
```

#### Misc
```ts
verifyToken(token: String!): User!
```
验证JWT合法性，用户开发模式

## Room房间对象

### 模式

```ts
type Room {
  roomId: ID!
  alias: String!
  users: [User]!
  admins: [User]!
  pending: [User]!
  creator: User!
  public: Boolean
  widgets: [String]
  avatar: String
  updatedAt: String
}
```

1. roomId：房间唯一标识符
2. alias：房间昵称，注意可能不同用户创建相同昵称的房间
3. users：房间里的所有用户，全集
4. admins：房间管理员，为用户的子集
5. pending：待进入房间用户，目前无用。为以后的批量导入留有空间（Bulk injection）
6. creator：房间创建者
7. public：房间是否公开，如果公开其他用户不能检索房间内部的任何资源，只能看到房间预告（Teaser）。目前部分API对私有房间进行了支持
8. widgets：房间组件。预留属性，用于组件的延展。不光是视频资源、用户可以选择添加笔记、代办等组件。
9. updatedAt：房间更新时间

### API和返回值
#### 基本CRUD操作
```ts
rooms: [Room] // 所有房间，开发时使用，Query类型

allRooms(userId: ID): [Room] // 特定用户的所有房间，可见度根据房间public属性决定，Query类型

room(roomId: ID!): Room // 单个房间查询，Query类型

createRoom(alias: String! users: JSON! admins: JSON! public: Boolean avatar: String widgets: JSON ): Room! // 创建房间，Mutation类型

updateRoom(roomId: ID! alias: String admins: JSON users: JSON public: Boolean avatar: String widgets: JSON): Room // 更新房间，Mutation类型

deleteRoom(roomId: ID!): Room // 删除房间，Mutation类型
```


#### 复杂查询

```ts
resourceTeasersInRoom(roomId: ID! limit: Int): [ResourceResponse]
```

获取给定房间（roomId）中的所有资源预告（上限由limit）决定。
1. 聚合有效性判断（如果用户和房间的组合不符合规则，放弃聚合）
2. 向Bullet类进行如下操作获得资源组<BR>
    1. 过滤该房间下（roomId）所有弹幕 
    2. 根据资源ID（resourceId）进行组合
    3. 获取资源内最后一条弹幕的更新时间（max）作为聚合记录的排序条件
    4. 只投影获取资源ID和更新时间
    5. 更新时间降序排列
3. 对于每个资源组<BR>
    1. 获取该房间（roomId）、该资源（resourceId）的弹幕
    2. 更新时间降序排列
    3. 上限为limit个，预设值为2
    4. 填充两个数组，一个结果对象数组、一个非空资源组
4. 对于每一个房间下的资源
    1. 判断该资源（roomId）是否在非空资源组中
    2. 如果该资源不在非空资源组中，说明该资源聚合后没有弹幕，手工添加到结果对象数组中


具体实现参见 `graphql/resolvers/room.js:328`。


## Bullet弹幕对象
### 模式
```ts
type Bullet {
  bulletId: ID!
  user: User!
  room: Room
  source: String!
  resource: Resource!
  tags: [Tag]
  row: Int
  timestamp: Int!
  content: String!
  updatedAt: String
  createdAt: String
}
```

1. bulletId：弹幕ID，唯一标识
2. user：弹幕发送者
3. room：弹幕从属房间
4. source：弹幕源(URI类型，比如视频URL)
5. resource：对应资源（同一房间中）
6. tags：弹幕标签（详情见Tag文档）
7. row：弹幕行，用于插件注入展示
8. timestamp：弹幕时间戳，可以理解为溢出屏幕的弹幕列
9. content：弹幕内容
10. updatedAt：弹幕更新时间
11. createdAt：弹幕创建时间

### API和返回值

#### 基本CRUD操作
```ts
bullets: [Bullet] // 所有弹幕，开发时使用，Query类型

createBullet(roomId: ID! resourceId: ID! source: String! timestamp: Int! row: Int content: String!): Bullet! // 创建弹幕，Mutation类型

updateBullet(bulletId: ID! content: String resourceId: ID tags: JSON timestamp: Int row: Int): Bullet // 更新弹幕，Mutation类型

deleteBullet(bulletId: ID!): Bullet // 删除特定弹幕，Mutation类型
```

#### 其他查询（面向前端展示需求）
```ts
bulletsByUser(roomId: ID source: String resourceId: String userId: ID!): [Bullet]
```
获取用户的所有弹幕。目前前端没有应用。预想应用场景：用户可以检索自己的所有历史弹幕和其他互动，进行CRUD操作；用户可以选取部分弹幕添加至个人主页。

```ts
allBulletsInRoom(roomId: ID!): [Bullet]
```

房间里所有的弹幕。目前前端没有应用。预想应用场景：用于房间总览，热度排序，全房间弹幕过滤迅速定位资源（Advanced Bullet Search)。

```ts
allBulletsInResource(roomId: ID! resourceId: ID!): [Bullet]
```

特定资源下所有的弹幕。前端使用极广，是房间下资源详情页面加载时调用的API。用于资源内弹幕时间线展示。

## Resource资源对象
### 模式
```ts
type Resource {
  resourceId: ID!
  name: String
  room: Room!
  url: String
  avatar: String
  description: String
  tags: [Tag]
  user: User!
  updatedAt: String
  createdAt: String
  hidden: Boolean
}
```

1. resourceId：资源ID，唯一标识
2. name：资源名称
3. room：资源所在房间
4. url：资源URI
5. avatar：资源图片
6. description：资源描述
7. tags：资源标签
8. user：资源创建者
9. updatedAt：资源更新时间
10. createdAt：资源创建时间
11. hidden：资源可见，用于替换删除操作（保留数据和标签）

### API和返回值

#### 基本CRUD操作
```ts
resources: [Resource] // 所有资源，Query类型

resource(resourceId: ID!): Resource // 单个资源查询

createResource(roomId: ID! name: String! description: String url: String avatar: String tags: JSON): Resource!  // 创建资源，Mutation类型

updateResource(resourceId: ID! name: String description: String url: String avatar: String tags: JSON): Resource  // 更新特定资源，Mutation类型

deleteResource(resourceId: ID!): Resource // 删除特定资源，Mutation类型
```

#### 其他查询（面向前端展示需求）
```ts
findResources(userId: ID roomId: ID): [Resource]
```
1. 查找特定用户在特定房间创建的所有资源
2. 查找特定房间的所有资源
3. 查找特定用户创建的所有资源



## Tag标签对象
 
### 模式
```ts
type Tag {
  tagId: ID!
  name: String!
  count: Int!
}
```

1. tagId：标签ID，唯一标识
2. name：标签名称
3. count：标签被引用次数


### 查询
```ts
tags: [Tag] // 所有标签
searchTagByName(name: String): [Tag] // 正则搜索标签
```

### 标签引用规则
1. 当单个资源对象或弹幕对象被创建且带有标签时：<br>
    1. 对于所有已有标签，其引用+1
    2. 对于所有为存在标签，创建一个1引用的标签
2. 当单个弹幕对象被创建但没有标签时，会默认继承所属资源标签。
3. 当资源或弹幕对象被删除时，会减少其所含标签的1个引用
4. 当资源被隐藏（hidden）时，同样减少对应标签引用。

## Invitation房间邀请

### 模式

```ts
type RoomInvitation {
  invitationId: ID!
  user: User!
  room: Room
  accepted: Int!
  sentAt: String!
}
```

### CRUD
```ts
invitations: [RoomInvitation] // 当前用户所有的房间邀请，Query类型

roomInvitations(history: Boolean): [RoomInvitation] // 当前用户所有的房间邀请，包含无效邀请，Query类型

createRoomInvitation(roomId: ID! userId: ID!): RoomInvitation! // 创建房间邀请给目标用户，Mutation类型

acceptRoomInvitation(invitationId: ID!): RoomInvitation! // 接受目标房间邀请，Mutation类型

declineRoomInvitation(invitationId: ID!): RoomInvitation! // 拒绝目标房间邀请，Mutation类型
```

## Friend好友邀请

### 模式

```ts
type FriendInvitation {
  invitationId: ID!
  from: User!
  to: User!
  accepted: Int!
  sentAt: String!
}
```

### CRUD
```ts
friendInvitations(history: Boolean): [FriendInvitation] // 当前用户所有的好友邀请，包含历史已同意或拒绝的邀请，Query类型

allFriendInvitations: [FriendInvitation] // 当前用户待接受的所有好友邀请，Query类型

createFriendInvitation(to: ID!): FriendInvitation! // 创建好友邀请给目标用户，Mutation类型

acceptFriendInvitation(invitationId: ID!): FriendInvitation! // 接受目标用户好友邀请，Mutation类型

declineFriendInvitation(invitationId: ID!): FriendInvitation! // 拒绝目标用户好友邀请，Mutation类型

deleteFriend(userId: ID!): User  // 双向删除好友，Mutation类型

addFriendWithoutInvitation(to: ID!): FriendInvitation!  // 测试用API，跳过邀请直接添加双向好友，Mutation类型
```

### 邀请模式说明
两种邀请类型，目前是存储在不同的集合，因为邀请所对应的属性不一样。未来考虑插入一个新的`type`字段来帮助动态决定对象模型，这样可以把`from`、`to`动态映射到不同的对象，比如Room、User。

### 常量类型
1. -2：邀请从属实体被删除、或邀请被撤销。比如房间被删除
2. -1：邀请待回复
3. 0：邀请被拒绝
4. 1：邀请被同意
 
