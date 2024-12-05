const router = require('express').Router();
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (verified) next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
};

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({timestamp: -1});
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create post
router.post('/', auth, async (req, res) => {
    const post = new Post(req.body);
    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Other routes (update, delete)
router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(post);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;