//controller/commentController.js

const User = require('../models/User');
const Comment = require('../models/comment');
const Thread = require('../models/thread');

exports.createComment = async (req, res, next) => {
  try {

    const threadId = req.params.id;
    const { body } = req.body;
    const user = req.user;
   
    if (!body) 
      return res.status(400).json({ message: 'Comment body is required'});
    

    //fetch user data
    const dbUser = await User.findById(user._id);
    if (!dbUser) 
      return res.status(400).json({ message: 'User not found'});    


    //fetch thread data
    const thread = await Thread.findById(threadId);
    if (!thread) 
      return res.status(404).json({ message: 'Thread not found'});
    
    //create comment
    const comment = await Comment.create({
      thread: threadId,
      parentComment: null,
      user: dbUser._id,
      body
    });

    const populated = await comment.populate('user', 'username email');

    res.status(201).json(populated);

  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
};



//POST  Reply to another comment (nested comment)
exports.replyToComment = async (req, res, next) => {
  try {

    const parentId = req.params.id;
    const { body } = req.body;
    const user = req.user;

    if(!body)
      return res.status(400).json({ message: 'Comment body is required'});

    //validate parent comment
    const parent = await Comment.findById(parentId)
    if(!parent)
      return res.status(404).json({message: 'Parent comment not found'});


    const threadId = parent.thread; // parent comment in thread
    const dbUser = await User.findById(user._id);

    //create comment
    const comment = await Comment.create({
      thread: threadId,
      parentComment: parent._id,
      user: dbUser._id,
      body
    });

    const populated = await comment.populate('user', 'username email');

    res.status(201).json(populated);

  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
};



//DELETE      Delete the whole comment from parent and delete nested comment alone
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if(!comment) 
      return res.status(404).json({ message: 'Comment not found'});

    //Check if accessing is author or admin
    const notAuthor = comment.user.toString() !== req.user._id.toString();
    const notAdmin = req.user.role !== 'admin';

    if (notAuthor && notAdmin)
      return res.status(403).json({ message: 'Not authorized to delete comment, only author and admin are allowed'});
    
    //Delete comment 
    await comment.deleteOne();

    res.status(200).json({ message: 'Comment deleted successfullly'});

  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


//GET Get thread by Id with nested comments

exports.getThreadById = async (req, res, next) => {
  try {

    const thread = await Thread.findById(req.params.id)
                                          .populate('user', 'username email');

    if(!thread)
      return res.status(404).json({message: 'Thread Id not found'});


    //Fetch all comments for this thread
    const comments = await Comment.find({ thread: thread._Id})
                                          .populate('user', 'username email')
                                          .lean();

    //Buil tree for comment in thread
    const map = {};
    comments.forEach(c => {
      c.children = [];
      map[c._id.toString()] = c;
    });

    const roots = [];
    comments.forEach(c => {
      if (c.parentComment) {
        const parent = map[c.parentComment.toString()];
        if (parent) 
          parent.children.push(c);        // attach to parent
        else roots.push(c);          // if parent not found, treat as root
      } else {
        roots.push(c);             // no parent → root comment
      }
    });

    res.json({
      thread,
      comments: roots
    });

  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};





