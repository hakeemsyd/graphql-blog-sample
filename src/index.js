import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

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
  id: '1',
  title: 'My awesome post with id 1',
  body: 'This is the body of my post',
  published: true,
  author: '1'
}, {
  id: '2',
  title: 'My awesome post 2',
  body: 'This is the body of my post',
  published: true,
  author: '1'
}, {
  id: '3',
  title: 'My awesome post 3',
  body: 'This is the body of my post',
  published: true,
  author: '2'
}];

const comments = [
  {
    id: '123',
    text: 'comment 124',
    user: '1',
    post: '3',
  }, {
    id: '124',
    text: 'comment 124',
    user: '2',
    post: '1'
  },{
    id: '125',
    text: 'comment 125',
    user: '3',
    post: '1'
  },{
    id: '126',
    text: 'comment 126',
    user: '2',
    post: '3'
  },{
    id: '127',
    text: 'comment 127',
    user: '3',
    post: '2'
  }
]

// scalar -> Boolean, ID, String, Float, Int
// schema
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    post: Post!
    comments: [Comment!]!
    posts(query: String): [Post!]!
    greeting(name: String): String!
    add(numbers: [Float!]!): Float!
    grades: [Int!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, user: ID!, post: ID!): Comment!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    user: User!
    post: Post!
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
    },
    comments(parent, args, ctx, info) {
      return comments;
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => {
        return user.email === args.email;
      });

      if (emailTaken) {
        throw new Error('Email already taken.');
      }

      const user = {
        id: uuidv4(),
        ...args
      };

      users.push(user);
      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists =  users.some((user) => {
        return user.id === args.author;
      });
      if(!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args
      }

      posts.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists =  users.some((user) => {
        return user.id === args.user;
      });

      const postExists = posts.some((post) => {
        return args.post === post.id;
      });

      if (!userExists || !postExists) {
        throw new Error('Either post or user does not exist');
      }

      const comment = {
        id: uuidv4(),
        ...args
      }

      comments.push(comment);
      return comment;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return parent.id === comment.post;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.user === parent.id;
      });
    }
  },
  Comment: {
    user(parent, args, ctx, info) {
      return users.find((user) => {
        return parent.user === user.id;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return parent.post === post.id;
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
