const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Sukses terhubung ke Database MongoDB'))
    .catch((err) => console.error('❌ Gagal terhubung ke MongoDB:', err.message));


app.get('/', (req, res) => {
    res.send('API UMKM Foodwaste Berjalan Lancar!');
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// 5. Menyalakan Mesin
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server backend menyala di http://localhost:${PORT}`);
});