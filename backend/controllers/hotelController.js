const Hotel = require('../models/Hotel');

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
exports.getHotels = async (req, res) => {
    try {
        let queryStr = JSON.stringify(req.query);
        // Create operators ($gt, $gte, etc) if needed for advanced filtering
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        let queryObj = JSON.parse(queryStr);
        
        // If searching by location, use regex for partial match
        if (req.query.location) {
            queryObj.location = { $regex: req.query.location, $options: 'i' };
        }

        const hotels = await Hotel.find(queryObj).populate('provider', 'name email');
        res.status(200).json({ success: true, count: hotels.length, data: hotels });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id).populate('provider', 'name email');
        if (!hotel) {
            return res.status(404).json({ success: false, error: 'Hotel not found' });
        }
        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private (Provider/Admin)
exports.createHotel = async (req, res) => {
    try {
        // Add user to req.body
        req.body.provider = req.user.id;

        // Check for images (Cloudinary)
        if (req.files) {
            req.body.images = req.files.map(file => file.path);
        }

        const hotel = await Hotel.create(req.body);
        res.status(201).json({ success: true, data: hotel });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private (Provider/Admin)
exports.updateHotel = async (req, res) => {
    try {
        let hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ success: false, error: 'Hotel not found' });
        }

        // Make sure user is hotel provider or admin
        if (hotel.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to update this hotel' });
        }

        // Handle image uploads if any (Cloudinary)
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            req.body.images = [...hotel.images, ...newImages];
        }

        hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private (Provider/Admin)
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ success: false, error: 'Hotel not found' });
        }

        // Make sure user is hotel provider or admin
        if (hotel.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this hotel' });
        }

        await hotel.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Approve hotel
// @route   PUT /api/hotels/:id/approve
// @access  Private (Admin)
exports.approveHotel = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to approve hotels' });
        }

        let hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ success: false, error: 'Hotel not found' });
        }

        hotel = await Hotel.findByIdAndUpdate(req.params.id, { isApproved: true }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
