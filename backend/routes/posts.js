const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/authMiddleware');

// routes/posts.js
router.post('/', async (req, res) => {
    try {
        const { title, content, author } = req.body;

        if (!title || !content || !author) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        const newPost = new Post({ title, content, author });
        const saved = await newPost.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});


// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username email');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// PUT /api/posts/:id
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        // Allow only the author to edit
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;

        const updatedPost = await post.save();
        res.status(200).json({ msg: 'Post updated', post: updatedPost });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});
// DELETE /api/posts/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        // Allow only the author to delete
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await post.remove();
        res.status(200).json({ msg: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;
