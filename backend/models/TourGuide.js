const mongoose = require('mongoose');

const TourGuideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    bio: {
        type: String,
        required: [true, 'Please add a bio']
    },
    languages: {
        type: [String],
        required: [true, 'Please add languages spoken']
    },
    experienceLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Expert'],
        default: 'Intermediate'
    },
    profileImage: {
        type: String,
        default: ''
    },
    contactNumber: {
        type: String,
        required: [true, 'Please add a contact number']
    },
    dailyRate: {
        type: Number,
        required: [true, 'Please add a daily rate']
    },
    isVerified: {
        type: Boolean,
        default: false // High rating verified badge
    },
    isApproved: {
        type: Boolean,
        default: false // Admin approval required to be visible
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

module.exports = mongoose.model('TourGuide', TourGuideSchema);
