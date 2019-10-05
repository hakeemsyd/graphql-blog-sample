import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
import db from './db'

// resolvers
const resolvers = {
  Query: {
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users;
      }

      return db.users.filter((user) => {
        return user.name.toLowerCase().includes(args.query);
      });
    },
    posts(parent, args, { db }, info) {
      if (!args.query) {
        return db.posts;
      }
      return db.posts.filter((post) => {
        return post.title.toLowerCase().includes(args.query);
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments;
    }
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some((user) => {
        return user.email === args.data.email;
      });

      if (emailTaken) {
        throw new Error('Email already taken.');
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      db.users.push(user);
      return user;
    },
    deleteUser(parent, args, { db }, info) {
      const userIdx = db.users.findIndex((user) => {
         return user.id === args.id
      });

      if (userIdx === -1) {
        throw new Error('User not found');
      }
      const deletedUsers = db.users.splice(userIdx, 1)

      db.posts = db.posts.filter((post) => {
          const match = post.author === args.id;
          if (match) {
            db.comments = db.comments.filter((comment) => comment.post !== post.id)
          }
          return match;
      });

      db.comments = db.comments.filter((comment) => comment.author !== args.id)
      return deletedUsers[0];
    },
    createPost(parent, args, { db }, info) {
      const userExists =  db.users.some((user) => {
        return user.id === args.data.author;
      });
      if(!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args.data
      }

      db.posts.push(post);
      return post;
    },
    deletePost(parent, args, { db }, info) {
      const postIdx = db.posts.findIndex((post) => post.id === args.id)
      if(postIdx === -1) {
        throw new Error('Post not found');
      }

      db.comments = db.comments.filter((comment) => {
        return comment.post !== args.id;
      })

      const post = db.posts.splice(postIdx, 1)[0];
      return post;
    },
    createComment(parent, args, { db }, info) {
      const userExists =  db.users.some((user) => {
        return user.id === args.data.user;
      });

      const postExists = db.posts.some((post) => {
        return args.data.post === post.id;
      });

      if (!userExists || !postExists) {
        throw new Error('Either post or user does not exist');
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      }

      db.comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, { db }, info) {
      const commentIdx = db.comments.findIndex((comment) => comment.id === args.id)
      if (commentIdx === -1) {
        throw new Error('Comment not found')
      }

      const deletedComment = db.comments.splice(commentIdx, 1)[0];
      return deletedComment;
    }
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => {
        return parent.id === comment.post;
      });
    }
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => {
        return comment.user === parent.id;
      });
    }
  },
  Comment: {
    user(parent, args, { db }, info) {
      return db.users.find((user) => {
        return parent.user === user.id;
      });
    },
    post(parent, args, { db }, info) {
      return db.posts.find((post) => {
        return parent.post === post.id;
      });
    }
  }
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
