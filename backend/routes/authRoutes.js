const express = require('express');
const { register, login, getMe, updateDetails, deleteMe } = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.delete('/deleteme', protect, deleteMe);

module.exports = router;
