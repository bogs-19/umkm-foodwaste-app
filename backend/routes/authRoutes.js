const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile, updatePassword } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware'); // Import middleware satpam

// Rute Publik (Tanpa Token)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rute Privat (Wajib pakai Token JWT) -> Gunakan PUT untuk proses update
router.put('/profile', verifyToken, updateProfile);
router.put('/password', verifyToken, updatePassword);

module.exports = router;