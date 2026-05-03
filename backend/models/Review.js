const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating between 1 and 5']
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
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent user from submitting more than one review per item
ReviewSchema.index({ itemId: 1, user: 1 }, { unique: true });

// Static method to get avg rating
ReviewSchema.statics.getAverageRating = async function (itemId) {
    const obj = await this.aggregate([
        {
            $match: { itemId: itemId }
        },
        {
            $group: {
                _id: '$itemId',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        if (obj[0]) {
            console.log(`Average rating for ${itemId} is ${obj[0].averageRating}`);
        }
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.itemId);
});

// Call getAverageRating before remove
ReviewSchema.pre('deleteOne', { document: true }, function () {
    this.constructor.getAverageRating(this.itemId);
});

module.exports = mongoose.model('Review', ReviewSchema);
