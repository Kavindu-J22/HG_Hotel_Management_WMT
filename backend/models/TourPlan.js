const mongoose = require('mongoose');

const TourPlanSchema = new mongoose.Schema({
    guide: {
        type: mongoose.Schema.ObjectId,
        ref: 'TourGuide',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a plan title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    destinations: {
        type: [String],
        required: [true, 'Please add destinations']
    },
    durationDays: {
        type: Number,
        required: [true, 'Please add duration in days']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    images: {
        type: [String],
        default: []
    },
    amenities: {
        type: [String],
        default: []
    },
    pax: {
        type: Number,
        required: [true, 'Please specify maximum group size (pax)']
    },
    transport: {
        type: String,
        required: [true, 'Please specify transport method']
    },
    isActive: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model('TourPlan', TourPlanSchema);
