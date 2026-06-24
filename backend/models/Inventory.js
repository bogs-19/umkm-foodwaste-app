const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // 👈 INI KUNCI UTAMANYA: Mengikat barang ke User yang login
        required: true
    },
    nama: { type: String, required: true },
    sisa: { type: String, required: true },
    sisaWaktu: { type: String, required: true },
    status: { type: String, required: true },
    gambar: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);