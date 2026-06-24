const Inventory = require('../models/Inventory');

// Ambil barang HANYA milik user yang sedang login
exports.getInventory = async (req, res) => {
    try {
        // req.user.id didapat dari authMiddleware (verifyToken) Anda
        const items = await Inventory.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data barang." });
    }
};

// Tambah barang baru
exports.addInventory = async (req, res) => {
    try {
        const { nama, sisa, sisaWaktu, status, gambar } = req.body;

        const newItem = await Inventory.create({
            userId: req.user.id, // 👈 Otomatis memasukkan ID user dari JWT Token
            nama, sisa, sisaWaktu, status, gambar
        });

        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: "Gagal menyimpan barang." });
    }
};