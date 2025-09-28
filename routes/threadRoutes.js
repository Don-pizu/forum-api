// routes/threadRoutes.js

const express = require('express');
const router = express.Router();
const { createThread, getAllThreads, getThreadById, updateThread, deleteThread } = require('../controllers/threadController');
const { protect, protectRoles } = require('../middleware/authMiddleware');

router.post('/threads', protect, createThread);
router.get('/threads', getAllThreads);
router.get('/threads/:id', getThreadById);
router.put('/threads/:id', protect, updateThread);
router.delete('/threads/:id', protect, protectRoles('admin'), deleteThread );

module.exports = router;
