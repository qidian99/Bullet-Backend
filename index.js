require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const {
	ApolloServer
} = require('apollo-server');
const models = require('./models') // require before resolvers to register the schemas
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers')
// const authRoutes = require './routes/auth';
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/errorHandler');

const url = `mongodb+srv://tritonbyte:${process.env.MONGO_PASSWORD}@bullet.yx3on.mongodb.net/bullet?retryWrites=true&w=majority`
// const url = 'mongodb://localhost:27017/bullet';

const app = express();

app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());
app.use(cors);
app.use(errorHandler);

const {
	getUser
} = require('./util');

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({
		req
	}) => {
		const tokenWithBearer = req.headers.authorization || ''
		const token = tokenWithBearer.split(' ')[1]
		const user = getUser(token)

		return {
			user,
		}
	},
	formatError: (err) => {
		console.log(err);
		return new Error(err.message);
	},
});

server.listen().then(({
	url
}) => {
	console.log(`Server ready at ${url}`)
});

mongoose
	.connect(url, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.catch(err => console.log(err));