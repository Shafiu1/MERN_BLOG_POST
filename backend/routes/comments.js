const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/authMiddleware');

// Get all comments for a post
router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Add a comment to a post
router.post('/:postId', authMiddleware, async (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ msg: 'Content is required' });

    try {
        const comment = new Comment({
            post: req.params.postId,
            user: req.user.id,
            content,
        });
        const saved = await comment.save();
        const populated = await saved.populate('user', 'username');
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
