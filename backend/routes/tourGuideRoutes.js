const express = require('express');
const {
    getGuides,
    getGuide,
    createGuide,
    updateGuide,
    deleteGuide,
    approveGuide
} = require('../controllers/tourGuideController');
const upload = require('../middlewares/uploadMiddleware');
const { protect, authorize } = require('../middlewares/authMiddleware');

const tourPlanRouter = require('./tourPlanRoutes');

const router = express.Router();

// A trick to allow optional auth for getGuides to check for approved mode
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        return protect(req, res, next);
    }
    return next();
};

router.use('/:guideId/plans', tourPlanRouter);

router
    .route('/')
    .get(optionalAuth, getGuides)
    .post(protect, authorize('provider'), upload.single('profileImage'), createGuide);

router
    .route('/:id')
    .get(optionalAuth, getGuide)
    .put(protect, authorize('provider', 'admin'), upload.single('profileImage'), updateGuide)
    .delete(protect, authorize('provider', 'admin'), deleteGuide);

router
    .route('/:id/approve')
    .put(protect, authorize('admin'), approveGuide);

module.exports = router;
