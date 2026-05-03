const express = require('express');
const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview,
    getProviderReviews,
    replyToReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router
    .route('/provider')
    .get(protect, authorize('provider', 'admin'), getProviderReviews);

router
    .route('/')
    .get(getReviews)
    .post(protect, authorize('tourist'), addReview);

router
    .route('/:id/reply')
    .put(protect, authorize('provider', 'admin'), replyToReview);

router
    .route('/:id')
    .get(getReview)
    .put(protect, authorize('tourist', 'admin'), updateReview)
    .delete(protect, authorize('tourist', 'admin'), deleteReview);

module.exports = router;
