const Comment = {
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

export {Comment as default}
