const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    media: {
        type: { type: String, enum: ['image', 'video'] },
        url: String
    }
});

module.exports = mongoose.model('Post', PostSchema);