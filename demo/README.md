# Bullet模型补充文档

本文档主要对以下模型进行技术性说明：
1. User：Bullet用户对象
2. Room：房间对象，为用户创建，可公开或私有
3. Invitation：房间邀请
4. Tag：标签对象
5. Bullet：弹幕对象
6. Resource：资源对象
7. Friend：好友邀请

同时我也录制了后端API交互界面演示助于理解：

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

