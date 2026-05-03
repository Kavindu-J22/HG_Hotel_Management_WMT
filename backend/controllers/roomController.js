const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

// @desc    Get rooms
// @route   GET /api/rooms
// @route   GET /api/hotels/:hotelId/rooms
// @access  Public
exports.getRooms = async (req, res) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude from direct match
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        const parsedQuery = JSON.parse(queryStr);

        if (req.params.hotelId) {
            parsedQuery.hotel = req.params.hotelId;
            query = Room.find(parsedQuery);
        } else {
            query = Room.find(parsedQuery).populate({
                path: 'hotel',
                select: 'name location'
            });
        }

        const rooms = await query;
        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate({
            path: 'hotel',
            select: 'name location provider'
        });

        if (!room) {
            return res.status(404).json({ success: false, error: 'Room not found' });
        }

        res.status(200).json({ success: true, data: room });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Add room
// @route   POST /api/hotels/:hotelId/rooms
// @access  Private (Provider/Admin)
exports.addRoom = async (req, res) => {
    try {
        req.body.hotel = req.params.hotelId;

        const hotel = await Hotel.findById(req.params.hotelId);

        if (!hotel) {
            return res.status(404).json({ success: false, error: 'Hotel not found' });
        }

        // Make sure user is hotel provider
        if (hotel.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to add a room to this hotel' });
        }

        if (req.files) {
            req.body.images = req.files.map(file => file.path);
        }

        const room = await Room.create(req.body);

        res.status(201).json({ success: true, data: room });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Provider/Admin)
exports.updateRoom = async (req, res) => {
    try {
        let room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ success: false, error: 'Room not found' });
        }

        const hotel = await Hotel.findById(room.hotel);

        // Make sure user is hotel provider
        if (hotel.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to update this room' });
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            req.body.images = [...room.images, ...newImages];
        }

        room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: room });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Provider/Admin)
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ success: false, error: 'Room not found' });
        }

        const hotel = await Hotel.findById(room.hotel);

        // Make sure user is hotel provider
        if (hotel.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this room' });
        }

        await room.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
