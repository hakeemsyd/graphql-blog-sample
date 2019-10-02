import { GraphQLServer } from 'graphql-yoga'

// Demo user data
const users = [{
  id: '1',
  name: 'Hakeem',
  email: 'hakeem@example.com'
}, {
  id: '2',
  name: 'Sara',
  email: 'sara@example.com'
}, {
  id: '3',
  name: 'Mike',
  email: 'mike@example.com'
}];

const posts = [{
  id: 1,
  title: 'My awesome post',
  body: 'This is the body of my post',
  published: true,
  author: '1'
}, {
  id: 2,
  title: 'My awesome post 2',
  body: 'This is the body of my post',
  published: true,
  author: '1'
}, {
  id: 3,
  title: 'My awesome post 3',
  body: 'This is the body of my post',
  published: true,
  author: '2'
}];

// scalar -> Boolean, ID, String, Float, Int
// schema
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    post: Post!
    posts(query: String): [Post!]!
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
    author: User!
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
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query);
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        return post.title.toLowerCase().includes(args.query);
      });
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id == parent.author;
      });
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
