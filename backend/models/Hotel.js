const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a hotel name']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    facilities: {
        type: [String],
        default: []
    },
    images: {
        type: [String], // Array of image URLs/paths
        default: []
    },
    isApproved: {
        type: Boolean,
        default: false // Admin approval required
    },
    provider: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must can not be more than 5']
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hotel', HotelSchema);
