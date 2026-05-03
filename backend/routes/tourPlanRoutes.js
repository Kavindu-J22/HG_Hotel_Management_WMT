const express = require('express');
const {
    getPlans,
    getPlan,
    addPlan,
    updatePlan,
    deletePlan
} = require('../controllers/tourPlanController');
const upload = require('../middlewares/uploadMiddleware');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getPlans)
    .post(protect, authorize('provider', 'admin'), upload.array('images', 5), addPlan);

router
    .route('/:id')
    .get(getPlan)
    .put(protect, authorize('provider', 'admin'), upload.array('images', 5), updatePlan)
    .delete(protect, authorize('provider', 'admin'), deletePlan);

module.exports = router;
