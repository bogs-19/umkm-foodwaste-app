const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    // Ambil token dari header "Authorization: Bearer <token>"
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: "Akses ditolak! Token tidak ada." });

    const token = authHeader.split(' ')[1];

    try {
        // Bongkar tokennya menggunakan kunci rahasia
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'rahasia_negara_123');
        req.user = verified; // Titipkan data ID user ke request untuk dipakai di controller
        next(); // Lanjut ke fungsi berikutnya
    } catch (error) {
        res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa!" });
    }
};