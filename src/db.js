
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

const db = {
  users,
  posts,
  comments
}

export {db as default}
