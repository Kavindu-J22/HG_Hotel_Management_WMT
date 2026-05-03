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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hotel', HotelSchema);
