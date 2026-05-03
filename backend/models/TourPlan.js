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
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TourPlan', TourPlanSchema);
