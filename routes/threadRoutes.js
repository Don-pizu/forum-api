// routes/threadRoutes.js

const express = require('express');
const router = express.Router();
const { createThread, getAllThreads, getThreadById, updateThread, deleteThread, voteThread, getAllThreadsAdmin  } = require('../controllers/threadController');
const { protect, protectRoles } = require('../middleware/authMiddleware');

router.post('/threads', protect, createThread);
router.get('/threads', protect, protectRoles('admin'), getAllThreads);
router.get('/threads/:id', getThreadById);
router.put('/threads/:id', protect, updateThread);
router.delete('/threads/:id', protect, protectRoles('admin'), deleteThread );
router.post('/threads/:id/vote', protect, voteThread);

router.get('/admin/threads', protect, protectRoles('admin'), getAllThreadsAdmin);


module.exports = router;
