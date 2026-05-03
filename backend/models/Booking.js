const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    bookingId: {
        type: String,
        unique: true
    },
    itemType: {
        type: String,
        enum: ['Room', 'Vehicle', 'TourPlan', 'TourGuide'],
        required: true
    },
    itemId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'itemType'
    },
    provider: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please add an end date']
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Generate unique bookingId before saving
BookingSchema.pre('save', async function() {
    if (!this.bookingId) {
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.bookingId = `BKG-${randomStr}`;
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
