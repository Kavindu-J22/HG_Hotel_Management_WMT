const express = require('express');
const {
    getVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');
const upload = require('../middlewares/uploadMiddleware');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// A trick to allow optional auth for getVehicles to check for maintenance mode
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        return protect(req, res, next);
    }
    return next();
};

router
    .route('/')
    .get(optionalAuth, getVehicles)
    .post(protect, authorize('provider', 'admin'), upload.array('images', 5), createVehicle);

router
    .route('/:id')
    .get(optionalAuth, getVehicle)
    .put(protect, authorize('provider', 'admin'), upload.array('images', 5), updateVehicle)
    .delete(protect, authorize('provider', 'admin'), deleteVehicle);

module.exports = router;
