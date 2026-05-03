const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    itemType: {
        type: String,
        enum: ['Hotel', 'Vehicle', 'TourGuide'],
        required: true
    },
    itemId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'itemType'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate items in wishlist
WishlistSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
