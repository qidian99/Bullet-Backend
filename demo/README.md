# Bullet模型技术文档

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
4. email: 邮箱，可选。以后可以同过用户名或密码进行登录
5. avatar、firstname、lastname：用户资料中存储的姓、名、头像
    * 一开始所有图片资源尝试过base64存储在数据库中，特别占据索引
    * 目前前后端统一意见，所有媒体类型只支持URI
    * 使用S3桶或者腾讯对象存储COS进行哈希和存储
6. friends：用户的所有好友，后端存储为用户ID，前端会自动填充为User对象

### API和返回值

```ts
type LoginResponse {
  user: User!
  token: String!
}
```
用户成功登录以后的返回结果
1. user为用户对象，可选择性地提取属性(GraphQL特性)
2. token为JWT，前端或插件会保存到对应的localStorage或者chrome.sync.storage中


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



