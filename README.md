# Bullet后端部署文档

## 技术

1. node. JS的后端server
2. GraphQL. Facebook的Graph API server, 比REST不知道强到哪里去了
3. ApolloServer. 与前端的ApolloClient连接，以后加Socket只需要几秒钟。
    * 注：如果前端是Vanilla JS，也可以连接ApolloClient，需要用到subscription-transport-ws这个包
    * 详情了解：https://github.com/apollographql/subscriptions-transport-ws
4. MongoDB. NoSQL，存非结构数据和进行Aggregation完爆SQL，慢点就慢点吧

## 安装
1. 本地下载MongoDB。如果是Macbook可以`brew install`；如果是Windows建议安装MongoDB Compass Community版本。如果是其他电脑建议买一台Macbook或者Windows。

2. `npm install`，会下载所有的依赖

3. 启动
* `npm start`

* `npx nodemon index.js`

3. GraphQL起步
* 所有GraphiQL API起步文件都在`Query`这个目录下是
* 本机`npm start`直接访问`localhost:4000`进入GraphiQL界面
* 可以选择复制`Query`文件夹下的Queries和Mutations，也可以自己写。
