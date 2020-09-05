# Bullet后端部署文档

## 技术

1. node. JS的后端server
2. GraphQL. Facebook的Graph API server, 比REST不知道强到哪里去了
3. ApolloServer. 与前端的ApolloClient连接，以后加Socket只需要几秒钟。
    * 注：如果前端是Vanilla JS，也可以连接ApolloClient，需要用到subscription-transport-ws这个包
    * 详情了解：https://github.com/apollographql/subscriptions-transport-ws
4. MongoDB. NoSQL，存非结构数据和进行Aggregation完爆SQL，慢点就慢点吧

## 项目结构

1. `controllers/`: 为以后Email或者SMS验证留下来的REST API

2. `graphql/`<br>
    1. `schema/`: GraphQL所有的模式定义,将MongoDB的模式暴露给API
    2. `resolvers/`: GraphQL所有的处理器定义，从数据库请求数据并返回

3. `middlewares/`: CORS、异常处理等中间件

4. `model/`: MongoDB所有的模式定义

5. `util/`: 功能函数，比如封装从JWT获取当前用户

6. `doc/`: 后端所有API的文档，从`index.html`进入

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
