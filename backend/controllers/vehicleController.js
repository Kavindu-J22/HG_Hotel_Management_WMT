const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
exports.getVehicles = async (req, res) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Don't show vehicles in maintenance mode to public
        if (!req.user || req.user.role === 'tourist') {
            reqQuery.maintenanceMode = false;
        }

        query = Vehicle.find(reqQuery).populate('provider', 'name email');

        const vehicles = await query;

        res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
exports.getVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate('provider', 'name email');

        if (!vehicle) {
            return res.status(404).json({ success: false, error: 'Vehicle not found' });
        }

        // Hide if maintenance mode and user is not provider/admin
        if (vehicle.maintenanceMode && (!req.user || (vehicle.provider._id.toString() !== req.user.id && req.user.role !== 'admin'))) {
            return res.status(404).json({ success: false, error: 'Vehicle is currently unavailable' });
        }

        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private (Provider/Admin)
exports.createVehicle = async (req, res) => {
    try {
        req.body.provider = req.user.id;

        if (req.files) {
            req.body.images = req.files.map(file => `/uploads/${file.filename}`);
        }

        const vehicle = await Vehicle.create(req.body);
        res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Provider/Admin)
exports.updateVehicle = async (req, res) => {
    try {
        let vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ success: false, error: 'Vehicle not found' });
        }

        if (vehicle.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to update this vehicle' });
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            req.body.images = [...vehicle.images, ...newImages];
        }

        vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Provider/Admin)
exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ success: false, error: 'Vehicle not found' });
        }

        if (vehicle.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this vehicle' });
        }

        await vehicle.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
