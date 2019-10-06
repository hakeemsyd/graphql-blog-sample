import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Comment from './resolvers/Comment'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Subscription from './resolvers/Subscription'

const pubSub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: {
    db,
    pubSub
  }
});

server.start(() => {
  console.log('Server is up!');
});
