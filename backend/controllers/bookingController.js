const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Vehicle = require('../models/Vehicle');
const TourPlan = require('../models/TourPlan');
const TourGuide = require('../models/TourGuide');
const sendEmail = require('../utils/sendEmail');
const generatePDF = require('../utils/generatePDF');
const fs = require('fs');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
    try {
        let query;

        // If user is tourist, get their bookings. If provider, get bookings for their items
        if (req.user.role === 'tourist') {
            query = Booking.find({ user: req.user.id });
        } else if (req.user.role === 'provider') {
            query = Booking.find({ provider: req.user.id });
        } else {
            query = Booking.find(); // admin
        }

        const bookings = await query.populate({
            path: 'itemId',
            select: 'title name brand model'
        }).populate('user', 'name email');

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate({
            path: 'itemId',
            select: 'title name brand model'
        }).populate('user', 'name email');

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Make sure user is booking owner or provider or admin
        if (booking.user._id.toString() !== req.user.id && booking.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to view this booking' });
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Add booking (Check availability and book)
// @route   POST /api/bookings
// @access  Private (Tourist)
exports.addBooking = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const { itemType, itemId, startDate, endDate } = req.body;

        // Validate Item exists and find Provider
        let item, providerId, pricePerDay;
        if (itemType === 'Room') {
            item = await Room.findById(itemId).populate('hotel');
            if (!item) return res.status(404).json({ success: false, error: 'Room not found' });
            providerId = item.hotel.provider;
            pricePerDay = item.pricePerNight;
        } else if (itemType === 'Vehicle') {
            item = await Vehicle.findById(itemId);
            if (!item) return res.status(404).json({ success: false, error: 'Vehicle not found' });
            providerId = item.provider;
            pricePerDay = item.dailyRate;
        } else if (itemType === 'TourPlan') {
            item = await TourPlan.findById(itemId).populate('guide');
            if (!item) return res.status(404).json({ success: false, error: 'TourPlan not found' });
            providerId = item.guide.user;
            pricePerDay = item.price / item.durationDays; // approx
        } else if (itemType === 'TourGuide') {
            item = await TourGuide.findById(itemId);
            if (!item) return res.status(404).json({ success: false, error: 'TourGuide not found' });
            providerId = item.user;
            pricePerDay = item.dailyRate;
        } else {
            return res.status(400).json({ success: false, error: 'Invalid itemType' });
        }

        req.body.provider = providerId;

        // Calculate total price
        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        if (days <= 0) return res.status(400).json({ success: false, error: 'Invalid dates' });
        req.body.totalPrice = (days * pricePerDay).toFixed(2);

        // Check availability (simplified logic: check if existing overlapping bookings are Confirmed/Pending)
        const overlappingBookings = await Booking.find({
            itemId: itemId,
            status: { $in: ['Pending', 'Confirmed'] },
            $or: [
                { startDate: { $lte: endDate, $gte: startDate } },
                { endDate: { $gte: startDate, $lte: endDate } },
                { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
            ]
        });

        if (overlappingBookings.length > 0) {
            return res.status(400).json({ success: false, error: 'Item is not available for these dates' });
        }

        const booking = await Booking.create(req.body);

        // Fetch provider to get email
        const User = require('../models/User'); // Import User model to fetch provider email
        const provider = await User.findById(providerId);

        // Send email to provider
        if (provider && provider.email && process.env.EMAIL_USER) {
            try {
                await sendEmail({
                    email: provider.email,
                    subject: 'New Booking Request Received',
                    message: `You have received a new booking request for ${itemType} (Ref: ${booking.bookingId}).\nDates: ${startDate} to ${endDate}\nTotal Price: $${req.body.totalPrice}\n\nPlease check your Provider Dashboard to confirm or reject this booking.`
                });
            } catch (e) {
                console.error('Failed to send email to provider', e);
            }
        }

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Provider/Admin)
exports.updateBooking = async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id).populate('user', 'name email');

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Make sure user is provider
        if (booking.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to update this booking' });
        }

        const { status } = req.body;
        booking = await Booking.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        // If confirmed, send email and PDF receipt
        if (status === 'Confirmed' && process.env.EMAIL_USER) {
            generatePDF(booking, booking.user, null, async (err, filePath, filename) => {
                if (!err) {
                    try {
                        await sendEmail({
                            email: booking.user.email,
                            subject: 'Booking Confirmation',
                            message: `Your booking (ID: ${booking.bookingId}) has been confirmed!`,
                            attachments: [
                                {
                                    filename: filename,
                                    path: filePath
                                }
                            ]
                        });
                        // Clean up temp pdf
                        fs.unlinkSync(filePath);
                    } catch (e) {
                        console.error('Email failed to send', e);
                    }
                }
            });
        }

        // If rejected, send rejection email
        if (status === 'Rejected' && process.env.EMAIL_USER) {
            try {
                await sendEmail({
                    email: booking.user.email,
                    subject: 'Booking Request Rejected',
                    message: `Unfortunately, your booking request (ID: ${booking.bookingId}) has been rejected by the provider. Please explore other available options in our app.`
                });
            } catch (e) {
                console.error('Failed to send rejection email to tourist', e);
            }
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete (cancel) booking
// @route   DELETE /api/bookings/:id
// @access  Private (Tourist/Admin)
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this booking' });
        }

        if (booking.status === 'Confirmed') {
            return res.status(400).json({ success: false, error: 'Cannot delete a confirmed booking' });
        }

        await booking.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update booking dates
// @route   PUT /api/bookings/:id/dates
// @access  Private (Tourist)
exports.updateBookingDates = async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this booking' });
        }

        if (booking.status !== 'Pending') {
            return res.status(400).json({ success: false, error: 'Cannot edit a booking that is not Pending' });
        }

        const { startDate, endDate } = req.body;

        // Recalculate total price
        let item, pricePerDay;
        const { itemType, itemId } = booking;
        if (itemType === 'Room') {
            item = await Room.findById(itemId);
            pricePerDay = item.pricePerNight;
        } else if (itemType === 'Vehicle') {
            item = await Vehicle.findById(itemId);
            pricePerDay = item.dailyRate;
        } else if (itemType === 'TourPlan') {
            item = await TourPlan.findById(itemId);
            pricePerDay = item.price / item.durationDays;
        } else if (itemType === 'TourGuide') {
            item = await TourGuide.findById(itemId);
            pricePerDay = item.dailyRate;
        }

        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        if (days <= 0) return res.status(400).json({ success: false, error: 'Invalid dates' });
        const totalPrice = (days * pricePerDay).toFixed(2);

        // Check availability
        const overlappingBookings = await Booking.find({
            _id: { $ne: booking._id },
            itemId: itemId,
            status: { $in: ['Pending', 'Confirmed'] },
            $or: [
                { startDate: { $lte: endDate, $gte: startDate } },
                { endDate: { $gte: startDate, $lte: endDate } },
                { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
            ]
        });

        if (overlappingBookings.length > 0) {
            return res.status(400).json({ success: false, error: 'Item is not available for these dates' });
        }

        booking.startDate = startDate;
        booking.endDate = endDate;
        booking.totalPrice = totalPrice;
        await booking.save();

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
