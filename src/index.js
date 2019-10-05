import { GraphQLServer } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Comment from './resolvers/Comment'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import User from './resolvers/User'

const resolvers = {
  Query,
  Mutation,
  User,
  Post,
  Comment
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db
  }
});

server.start(() => {
  console.log('Server is up!');
});
