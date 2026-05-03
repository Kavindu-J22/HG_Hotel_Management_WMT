const express = require('express');
const {
    getHotels,
    getHotel,
    createHotel,
    updateHotel,
    deleteHotel
} = require('../controllers/hotelController');
const upload = require('../middlewares/uploadMiddleware');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Include other resource routers
const roomRouter = require('./roomRoutes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:hotelId/rooms', roomRouter);

router
    .route('/')
    .get(getHotels)
    .post(protect, authorize('provider', 'admin'), upload.array('images', 5), createHotel);

router
    .route('/:id')
    .get(getHotel)
    .put(protect, authorize('provider', 'admin'), upload.array('images', 5), updateHotel)
    .delete(protect, authorize('provider', 'admin'), deleteHotel);

module.exports = router;
