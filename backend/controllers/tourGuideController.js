const TourGuide = require('../models/TourGuide');

// @desc    Get all tour guides
// @route   GET /api/guides
// @access  Public
exports.getGuides = async (req, res) => {
    try {
        const guides = await TourGuide.find().populate('user', 'name email');
        res.status(200).json({ success: true, count: guides.length, data: guides });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get single tour guide
// @route   GET /api/guides/:id
// @access  Public
exports.getGuide = async (req, res) => {
    try {
        const guide = await TourGuide.findById(req.params.id).populate('user', 'name email');

        if (!guide) {
            return res.status(404).json({ success: false, error: 'Tour Guide not found' });
        }

        res.status(200).json({ success: true, data: guide });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Create tour guide profile
// @route   POST /api/guides
// @access  Private (Provider)
exports.createGuide = async (req, res) => {
    try {
        // Only one guide profile per user
        const existingGuide = await TourGuide.findOne({ user: req.user.id });
        if (existingGuide) {
            return res.status(400).json({ success: false, error: 'User already has a guide profile' });
        }

        req.body.user = req.user.id;

        if (req.file) {
            req.body.profileImage = `/uploads/${req.file.filename}`;
        }

        const guide = await TourGuide.create(req.body);

        res.status(201).json({ success: true, data: guide });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update tour guide profile
// @route   PUT /api/guides/:id
// @access  Private (Provider/Admin)
exports.updateGuide = async (req, res) => {
    try {
        let guide = await TourGuide.findById(req.params.id);

        if (!guide) {
            return res.status(404).json({ success: false, error: 'Tour Guide not found' });
        }

        if (guide.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to update this profile' });
        }

        if (req.file) {
            req.body.profileImage = `/uploads/${req.file.filename}`;
        }

        guide = await TourGuide.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: guide });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete tour guide profile
// @route   DELETE /api/guides/:id
// @access  Private (Provider/Admin)
exports.deleteGuide = async (req, res) => {
    try {
        const guide = await TourGuide.findById(req.params.id);

        if (!guide) {
            return res.status(404).json({ success: false, error: 'Tour Guide not found' });
        }

        if (guide.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this profile' });
        }

        await guide.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
