const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ timestamp: -1 })
            .populate('author', 'username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const post = new Post({
            ...req.body,
            author: req.user.userId
        });
        await post.save();
        res.status(201).json(await post.populate('author', 'username'));
    } catch (error) {
        res.status(500).json({ message: 'Error creating post' });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id, author: req.user.userId });
        if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });
        
        Object.assign(post, req.body);
        await post.save();
        res.json(await post.populate('author', 'username'));
    } catch (error) {
        res.status(500).json({ message: 'Error updating post' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ 
            _id: req.params.id, 
            author: req.user.userId 
        });
        if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post' });
    }
});

module.exports = router;
