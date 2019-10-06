import uuidv4 from 'uuid/v4'

const Mutation = {
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
  updateUser(parent, args, {db}, info) {
    const user = db.users.find((user) => user.id === args.id)
    if (!user) {
      throw new Error('User not found')
    }

    if (typeof args.data.email === 'string') {
      const emailTaken = db.users.some((user) => user.email === args.data.email)
      if (emailTaken) {
        throw new Error('Email is already taken')
      }

      user.email = args.data.email
    }

    if (typeof args.data.name === 'string') {
      user.name = args.data.name;
    }

    if (typeof args.data.name != undefined) {
      user.age = args.data.age;
    }

    return user
  },
  createPost(parent, args, { db, pubSub }, info) {
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
    if (post.published) {
      pubSub.publish('POSTS', {post: {
          mutation: 'CREATED',
          data: post

      }})
    }
    return post;
  },
  deletePost(parent, args, { db, pubSub }, info) {
    const postIdx = db.posts.findIndex((post) => post.id === args.id)
    if(postIdx === -1) {
      throw new Error('Post not found');
    }

    db.comments = db.comments.filter((comment) => {
      return comment.post !== args.id;
    })

    const post = db.posts.splice(postIdx, 1)[0];
    pubSub.publish('POSTS', { post: {
        mutation: 'DELETED',
        data: post

    }})
    return post;
  },
  updatePost(parent, {id, data}, {db, pubSub}, info) {
    const post = db.posts.find((post) => post.id === id)
    if(!post) {
      throw new Error('Post not found')
    }

    if (typeof data.title === 'string') {
      post.title = data.title
    }

    if (typeof data.body === 'string') {
      post.body = data.body
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published
    }

    pubSub.publish('POSTS', { post: {
        mutation: 'UPDATED',
        data: post

    }})

    return post
  },
  createComment(parent, args, { db, pubSub }, info) {
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
    pubSub.publish(`COMMENT ${args.data.post}`,
        {
        comment: {
          mutation: 'CREATED',
          data: comment
        }
    })
    return comment;
  },
  deleteComment(parent, args, { db, pubSub }, info) {
    const commentIdx = db.comments.findIndex((comment) => comment.id === args.id)
    if (commentIdx === -1) {
      throw new Error('Comment not found')
    }

    const deletedComment = db.comments.splice(commentIdx, 1)[0];
    pubSub.publish(`COMMENT ${deletedComment.post}`,
        {
        comment: {
          mutation: 'DELETED',
          data: deletedComment
        }
    })
    return deletedComment;
  },
  updateComment(parent, {id, data}, {db, pubSub}, info) {
    const comment = db.comments.find((comment) => comment.id === id)

    if (!comment) {
      throw Error('Comment not found')
    }

    if (typeof data.text === 'string') {
      comment.text = data.text
    }

    pubSub.publish(`COMMENT ${comment.post}`,
        {
        comment: {
          mutation: 'UPDATED',
          data: comment
        }
    })

    return comment
  }
}

export {Mutation as default}
