const express = require('express');
const {
    getBookings,
    getBooking,
    addBooking,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // All routes require auth

router
    .route('/')
    .get(getBookings)
    .post(authorize('tourist', 'admin'), addBooking);

router
    .route('/:id')
    .get(getBooking)
    .put(authorize('provider', 'admin'), updateBooking)
    .delete(authorize('tourist', 'admin'), deleteBooking);

module.exports = router;
