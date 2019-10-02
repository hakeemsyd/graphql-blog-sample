import { GraphQLServer } from 'graphql-yoga'

// scalar -> Boolean, ID, String, Float, Int
// schema
const typeDefs = `
  type Query {
    me: User!,
    post: Post!
  }

  type User {
    id: ID!,
    name: String!,
    email: String!,
    age: Int
  }

  type Post {
    id: ID!,
    title: String!,
    body: String!,
    published: Boolean!
  }
`


// resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: 1,
        name: 'Syed Hakeem Abbas',
        email: 'hakeemsyd@gmail.com',
        age: 31
      }
    },
    post() {
      return {
        id: 1,
        title: 'My awesome post',
        body: 'This is the body of my post',
        published: true
      }
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('Server is up!');
});
