const Wishlist = require('../models/Wishlist');

// @desc    Get user wishlist
// @route   GET /api/wishlists
// @access  Private (Tourist)
exports.getWishlist = async (req, res) => {
    try {
        const wishlists = await Wishlist.find({ user: req.user.id })
            .populate('itemId')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: wishlists.length, data: wishlists });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Toggle item in wishlist (Add/Remove)
// @route   POST /api/wishlists/toggle
// @access  Private (Tourist)
exports.toggleWishlist = async (req, res) => {
    try {
        const { itemType, itemId } = req.body;
        const userId = req.user.id;

        const existingItem = await Wishlist.findOne({ user: userId, itemType, itemId });

        if (existingItem) {
            // Remove from wishlist
            await existingItem.deleteOne();
            res.status(200).json({ success: true, message: 'Removed from wishlist', action: 'removed' });
        } else {
            // Add to wishlist
            const newItem = await Wishlist.create({
                user: userId,
                itemType,
                itemId
            });
            res.status(201).json({ success: true, message: 'Added to wishlist', action: 'added', data: newItem });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Check if item is in wishlist
// @route   GET /api/wishlists/check/:itemType/:itemId
// @access  Private (Tourist)
exports.checkWishlist = async (req, res) => {
    try {
        const { itemType, itemId } = req.params;
        const userId = req.user.id;

        const existingItem = await Wishlist.findOne({ user: userId, itemType, itemId });

        res.status(200).json({ success: true, isWishlisted: !!existingItem });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
