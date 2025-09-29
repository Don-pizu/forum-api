const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  body: { 
    type: String, 
    required: true 
  },
  votes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vote: { type: Number, enum: [1, -1] } // 1 = upvote, -1 = downvote
  }],
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Thread', threadSchema);
