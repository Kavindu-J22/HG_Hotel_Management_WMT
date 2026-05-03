const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hotel',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a room title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    roomType: {
        type: String,
        required: [true, 'Please add a room type (e.g., Single, Double, Sea view, A/C)'],
        enum: ['Single', 'Double', 'Luxury', 'Sea view', 'A/C', 'Non-A/C']
    },
    pricePerNight: {
        type: Number,
        required: [true, 'Please add a price per night'],
        min: [0, 'Price must be positive']
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount must be positive'],
        max: [100, 'Discount cannot exceed 100%']
    },
    capacity: {
        type: Number,
        required: [true, 'Please add room capacity']
    },
    images: {
        type: [String],
        default: []
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['Available', 'Fully Booked', 'Maintenance'],
        default: 'Available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', RoomSchema);
