const Review = require('../models/Review');
const Hotel = require('../models/Hotel');
const Vehicle = require('../models/Vehicle');
const TourGuide = require('../models/TourGuide');

// @desc    Get reviews
// @route   GET /api/reviews
// @route   GET /api/items/:itemId/reviews
// @access  Public
exports.getReviews = async (req, res) => {
    try {
        let query;

        if (req.params.itemId) {
            query = Review.find({ itemId: req.params.itemId });
        } else {
            query = Review.find().populate({
                path: 'user',
                select: 'name'
            });
        }

        const reviews = await query;
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate({
            path: 'user',
            select: 'name'
        });

        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        res.status(200).json({ success: true, data: review });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Add review
// @route   POST /api/reviews
// @access  Private (Tourist)
exports.addReview = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const { itemType, itemId } = req.body;

        let item;
        if (itemType === 'Hotel') item = await Hotel.findById(itemId);
        else if (itemType === 'Vehicle') item = await Vehicle.findById(itemId);
        else if (itemType === 'TourGuide') item = await TourGuide.findById(itemId);

        if (!item) {
            return res.status(404).json({ success: false, error: `${itemType} not found` });
        }

        const review = await Review.create(req.body);

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        // Handle duplicate error (code 11000)
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'You have already reviewed this item' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to update review' });
        }

        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Trigger post save middleware
        await review.save();

        res.status(200).json({ success: true, data: review });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to delete review' });
        }

        await review.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
