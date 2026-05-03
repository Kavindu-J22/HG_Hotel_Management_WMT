const express = require('express');
const {
    getWishlist,
    toggleWishlist,
    checkWishlist
} = require('../controllers/wishlistController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('tourist'));

router
    .route('/')
    .get(getWishlist);

router
    .route('/toggle')
    .post(toggleWishlist);

router
    .route('/check/:itemType/:itemId')
    .get(checkWishlist);

module.exports = router;
