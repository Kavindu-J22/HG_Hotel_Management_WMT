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
    providerReply: {
        type: String,
        default: null
    },
    providerRepliedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent user from submitting more than one review per item
ReviewSchema.index({ itemId: 1, user: 1 }, { unique: true });

// Static method to get avg rating
ReviewSchema.statics.getAverageRating = async function (itemId, itemType) {
    const obj = await this.aggregate([
        {
            $match: { itemId: itemId }
        },
        {
            $group: {
                _id: '$itemId',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    try {
        let updateModel;
        if (itemType === 'Hotel') updateModel = mongoose.model('Hotel');
        else if (itemType === 'Vehicle') updateModel = mongoose.model('Vehicle');
        else if (itemType === 'TourGuide') updateModel = mongoose.model('TourGuide');

        if (updateModel) {
            if (obj[0]) {
                await updateModel.findByIdAndUpdate(itemId, {
                    averageRating: Math.round(obj[0].averageRating * 10) / 10,
                    reviewCount: obj[0].reviewCount
                });
            } else {
                await updateModel.findByIdAndUpdate(itemId, {
                    averageRating: undefined,
                    reviewCount: 0
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.itemId, this.itemType);
});

// Call getAverageRating before remove
ReviewSchema.pre('deleteOne', { document: true }, function () {
    this.constructor.getAverageRating(this.itemId, this.itemType);
});

module.exports = mongoose.model('Review', ReviewSchema);
