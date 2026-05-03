const express = require('express');
const {
    getGuides,
    getGuide,
    createGuide,
    updateGuide,
    deleteGuide
} = require('../controllers/tourGuideController');
const upload = require('../middlewares/uploadMiddleware');
const { protect, authorize } = require('../middlewares/authMiddleware');

const tourPlanRouter = require('./tourPlanRoutes');

const router = express.Router();

router.use('/:guideId/plans', tourPlanRouter);

router
    .route('/')
    .get(getGuides)
    .post(protect, authorize('provider'), upload.single('profileImage'), createGuide);

router
    .route('/:id')
    .get(getGuide)
    .put(protect, authorize('provider', 'admin'), upload.single('profileImage'), updateGuide)
    .delete(protect, authorize('provider', 'admin'), deleteGuide);

module.exports = router;
