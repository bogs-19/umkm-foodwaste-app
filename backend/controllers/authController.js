const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Cek apakah email sudah terdaftar
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email sudah terdaftar!" });

        // Proses Hashing (Pengacakan) Password dengan Bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan user baru ke database
        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "Akun berhasil dibuat! Silakan Login." });

    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Akun tidak ditemukan!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Password salah!" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'rahasia_negara_123',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login berhasil!",
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        // Cari user berdasarkan ID yang didapat dari JWT (req.user.id)
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true } // Kembalikan data yang baru
        );

        res.status(200).json({ message: "Profil diperbarui", user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email } });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server saat update profil." });
    }
};

// 4. Logika Update Password (Bcrypt)
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Cari user di database
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User tidak ditemukan!" });

        // Bandingkan password lama dengan hash di database
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: "Kata sandi saat ini (lama) salah!" });

        // Enkripsi password baru
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Simpan ke database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Kata sandi berhasil diperbarui dengan aman!" });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};