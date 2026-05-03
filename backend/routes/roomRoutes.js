const express = require('express');
const {
    getRooms,
    getRoom,
    addRoom,
    updateRoom,
    deleteRoom
} = require('../controllers/roomController');
const upload = require('../middlewares/uploadMiddleware');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getRooms)
    .post(protect, authorize('provider', 'admin'), upload.array('images', 5), addRoom);

router
    .route('/:id')
    .get(getRoom)
    .put(protect, authorize('provider', 'admin'), upload.array('images', 5), updateRoom)
    .delete(protect, authorize('provider', 'admin'), deleteRoom);

module.exports = router;
