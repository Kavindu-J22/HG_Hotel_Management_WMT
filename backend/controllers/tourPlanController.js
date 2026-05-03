const TourPlan = require('../models/TourPlan');
const TourGuide = require('../models/TourGuide');

// @desc    Get tour plans
// @route   GET /api/plans
// @route   GET /api/guides/:guideId/plans
// @access  Public
exports.getPlans = async (req, res) => {
    try {
        let query;

        if (req.params.guideId) {
            query = TourPlan.find({ guide: req.params.guideId });
        } else {
            query = TourPlan.find().populate({
                path: 'guide',
                select: 'bio experienceLevel profileImage user isVerified',
                populate: { path: 'user', select: 'name' }
            });
        }

        const plans = await query;
        res.status(200).json({ success: true, count: plans.length, data: plans });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get single tour plan
// @route   GET /api/plans/:id
// @access  Public
exports.getPlan = async (req, res) => {
    try {
        const plan = await TourPlan.findById(req.params.id).populate({
            path: 'guide',
            select: 'bio experienceLevel profileImage user isVerified',
            populate: { path: 'user', select: 'name email' }
        });

        if (!plan) {
            return res.status(404).json({ success: false, error: 'Tour Plan not found' });
        }

        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Add tour plan
// @route   POST /api/guides/:guideId/plans
// @access  Private (Provider/Admin)
exports.addPlan = async (req, res) => {
    try {
        req.body.guide = req.params.guideId;

        const guide = await TourGuide.findById(req.params.guideId);

        if (!guide) {
            return res.status(404).json({ success: false, error: 'Tour Guide not found' });
        }

        if (guide.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to add a plan to this guide' });
        }

        if (req.files) {
            req.body.images = req.files.map(file => `/uploads/${file.filename}`);
        }

        const plan = await TourPlan.create(req.body);

        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update tour plan
// @route   PUT /api/plans/:id
// @access  Private (Provider/Admin)
exports.updatePlan = async (req, res) => {
    try {
        let plan = await TourPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ success: false, error: 'Tour Plan not found' });
        }

        const guide = await TourGuide.findById(plan.guide);

        if (guide.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to update this plan' });
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            req.body.images = [...plan.images, ...newImages];
        }

        plan = await TourPlan.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete tour plan
// @route   DELETE /api/plans/:id
// @access  Private (Provider/Admin)
exports.deletePlan = async (req, res) => {
    try {
        const plan = await TourPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ success: false, error: 'Tour Plan not found' });
        }

        const guide = await TourGuide.findById(plan.guide);

        if (guide.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this plan' });
        }

        await plan.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
