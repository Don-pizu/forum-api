//routes/graphql.js

const express = require('express');
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const Thread = require('../models/thread');
const Comment = require('../models/comment');

const schema = buildSchema(`
  type User {
    _id: ID!
    username: String
    email: String
  }
  type Comment {
    _id: ID!
    body: String
    user: User
  }
  type Thread {
    _id: ID!
    title: String
    body: String
    user: User
    comments: [Comment]
  }
  type Query {
    threads: [Thread]
    thread(id: ID!): Thread
  }
`);

const root = {
  threads: async () => {
    return Thread.find().populate('user');
  },
  thread: async ({ id }) => {
    const thread = await Thread.findById(id).populate('user');
    if (!thread) return null;

    // Fetch related comments
    const comments = await Comment.find({ thread: thread._id }).populate('user');

    return {
      ...thread.toObject(),
      comments
    };
  },
};
router.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,    // GraphiQL playground enabled

}));

module.exports = router;