const express = require('express');
const path = require('path');
const cors = require('cors');

// Route modules
const healthRoutes = require('./routes/health');
const kontakRoutes = require('./routes/kontak');
const paketRoutes = require('./routes/paket');
const testimoniRoutes = require('./routes/testimoni');
const galeriRoutes = require('./routes/galeri');
const fasilitasRoutes = require('./routes/fasilitas');

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files ──
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// ── API Routes ──
app.use(healthRoutes);
app.use(kontakRoutes);
app.use(paketRoutes);
app.use(testimoniRoutes);
app.use(galeriRoutes);
app.use(fasilitasRoutes);

// ── Global error handler ──
app.use((err, _req, res, _next) => {
  res.status(400).json({ message: err.message || 'Terjadi kesalahan.' });
});

module.exports = app;
