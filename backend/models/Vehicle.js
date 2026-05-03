const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: [true, 'Please add a brand']
    },
    model: {
        type: String,
        required: [true, 'Please add a model']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    type: {
        type: String,
        enum: ['Car', 'Van', 'SUV', 'Bus'],
        required: [true, 'Please add a vehicle type']
    },
    fuel: {
        type: String,
        enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
        required: [true, 'Please add a fuel type']
    },
    seatingCapacity: {
        type: Number,
        required: [true, 'Please add seating capacity']
    },
    dailyRate: {
        type: Number,
        required: [true, 'Please add daily rental rate']
    },
    images: {
        type: [String],
        default: []
    },
    maintenanceMode: {
        type: Boolean,
        default: false // Hide from search if true
    },
    provider: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
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

module.exports = mongoose.model('Vehicle', VehicleSchema);
