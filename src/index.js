import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Demo user data
let users = [{
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

let posts = [{
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

let comments = [
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
        return user.email === args.data.email;
      });

      if (emailTaken) {
        throw new Error('Email already taken.');
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      users.push(user);
      console.log(users);
      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIdx = users.findIndex((user) => {
         return user.id === args.id
      });

      if (userIdx === -1) {
        throw new Error('User not found');
      }
      const deletedUsers = users.splice(userIdx, 1)

      posts = posts.filter((post) => {
          const match = post.author === args.id;
          if (match) {
            comments = comments.filter((comment) => comment.post !== post.id)
          }
          return match;
      });

      comments = comments.filter((comment) => comment.author !== args.id)
      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists =  users.some((user) => {
        return user.id === args.data.author;
      });
      if(!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args.data
      }

      posts.push(post);
      return post;
    },
    deletePost(parent, args, ctx, info) {
      const postIdx = posts.findIndex((post) => post.id === args.id)
      if(postIdx === -1) {
        throw new Error('Post not found');
      }

      comments = comments.filter((comment) => {
        return comment.post !== args.id;
      })

      const post = posts.splice(postIdx, 1)[0];
      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists =  users.some((user) => {
        return user.id === args.data.user;
      });

      const postExists = posts.some((post) => {
        return args.data.post === post.id;
      });

      if (!userExists || !postExists) {
        throw new Error('Either post or user does not exist');
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      }

      comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const commentIdx = comments.findIndex((comment) => comment.id === args.id)
      if (commentIdx === -1) {
        throw new Error('Comment not found')
      }

      const deletedComment = comments.splice(commentIdx, 1)[0];
      return deletedComment;
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
  typeDefs: './src/schema.graphql',
  resolvers
});

server.start(() => {
  console.log('Server is up!');
});
