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
    pricePerNight: {
        type: Number,
        required: [true, 'Please add a price per night']
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', RoomSchema);
