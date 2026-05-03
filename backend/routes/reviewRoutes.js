const express = require('express');
const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getReviews)
    .post(protect, authorize('tourist'), addReview);

router
    .route('/:id')
    .get(getReview)
    .put(protect, authorize('tourist', 'admin'), updateReview)
    .delete(protect, authorize('tourist', 'admin'), deleteReview);

module.exports = router;
