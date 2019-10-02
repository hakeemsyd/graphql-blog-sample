import { GraphQLServer } from 'graphql-yoga'

// scalar -> Boolean, ID, String, Float, Int
// schema
const typeDefs = `
  type Query {
    me: User!
    post: Post!
    greeting(name: String): String!
    add(numbers: [Float!]!): Float!
    grades: [Int!]!
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
    },
    greeting(parent, args, ctx, info) {
      console.log(args)
      if (args.name) {
        return `hello ${args.name}`
      } else {
        return 'hello'
      }
    },
    add(parent, args, ctx, info) {
      if (args.numbers.length === 0) {
        return 0;
      }

      return args.numbers.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      })
    },
    grades(parent, args, ctx, info) {
      return [99, 80, 93];
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
