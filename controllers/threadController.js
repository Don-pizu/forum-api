//controller/threadController.js

const User = require('../models/User');
const Thread = require('../models/thread');
const Comment = require('../models/comment');


//POST Thread
exports.createThread = async (req, res) => {
  try {

    const { title, body } = req.body;
    const user = req.user;

    //validate title and body content
    if (!title || !body) 
      return res.status(400).json({ message: 'title and body required'});

    if (!user)
      return res.status(401).json({ message: 'User not authenticated' });

    //fetch user data
    const dbUser = await User.findById(user._id);
    if (!dbUser) 
      return res.status(400).json({ message: 'User not found'});
    

    //Create Thread
    const thread = await Thread.create({ 
      title, 
      body, 
      user: dbUser._id
    });

    res.status(201).json({
      message: 'Thread created sucessfully',
      thread
    });

  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
};


//GET Get all the threads
exports.getAllThreads = async (req, res, next) => {
  try {

    const { page = 1, limit = 10, author, date } = req.query;
    const query = {};     // use for filtering

    const skip = (page - 1) * limit;       

    if (author) {
      query.user = author;     
    }

    if (date) {
      query.createdAt = { $gte: new Date(date) };
    }

    const thread = await Thread.find(query)
                                  .populate('user', 'username email')
                                  .skip(skip)
                                  .limit(parseInt(limit))
                                  .sort({ createdAt: -1 });

    const totalThreads = await Thread.countDocuments(query);
    const totalPages = Math.ceil (totalThreads / limit);

    res.json({
      thread,
      Page: parseInt(page),
      totalPages,
      totalThreads
    });

  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
}


//GET Get thread by Id with nested comments

exports.getThreadById = async (req, res, next) => {
  try {

    const thread = await Thread.findById(req.params.id)
                                          .populate('user', 'username email');

    if(!thread)
      return res.status(404).json({message: 'Thread Id not found'});


    //Fetch all comments for this thread
    const comments = await Comment.find({ thread: thread._id})
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
        if (parent) { 
          parent.children.push(c);         // attach to parent
        } else {
          roots.push(c);                  // if parent not found, treat as root
         }          
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


//PUT   Update thread by owner and admin
exports.updateThread = async (req, res, next) => {
  try {

    const thread = await Thread.findById(req.params.id);

    if (!thread)
      return res.status(404).json({ message: 'Thread not found'});

    //Chech if accessing is owner/admin
    const notAuthor = thread.user.toString() !== req.user._id.toString();
    const notAdmin = req.user.role !== 'admin';

    if (notAuthor && notAdmin)
      return res.status(403).json({ message: 'Not authorized to update thread, only author and admin are allowed'});

    //Update thread
    const { title, body } = req.body;
    if(title)
      thread.title = title;
    if(body)
      thread.body = body;

    await thread.save();

    res.status(200).json(thread);


  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteThread = async (req, res, next) => {
  try {

    const thread = await Thread.findById(req.params.id);

    if (!thread)
      return res.status(404).json({ message: 'Thread not found'});

    //Delete Thread and it comments
    await Comment.deleteMany({ thread: thread._id});  //delete all comments relating to the thread id
    await thread.deleteOne();

    res.status(200).json({ message: 'Thread and related comment deleted successfullly'});

  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


