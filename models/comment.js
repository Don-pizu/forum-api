const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  thread: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Thread', 
    required: true 
  },
  parentComment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment', 
    default: null 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  body: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
