//routes/commentRoutes.js

const express = require('express');
const router = express.Router();
const { createComment, replyToComment, deleteComment, getThreadById, voteComment, deleteCommentAdmin } = require('../controllers/commentController');
const { protect, protectRoles } = require('../middleware/authMiddleware');


// add comment to thread
router.post('/threads/:id/comments', protect, createComment);

// reply to comment
router.post('/comments/:id/reply', protect, replyToComment);

//delete comment by author and admin
router.delete('/comments/:id', protect,  protectRoles('admin'), deleteComment);

//get threads with nested comment
router.get('/threads/:id', getThreadById);

//vote
router.post('/comments/:id/vote', protect, voteComment);

router.delete('/admin/comments/:id', protect,  protectRoles('admin'), deleteCommentAdmin);

module.exports = router;
