const { Router } = require('express');
const { runQuery } = require('../config/db');

const router = Router();

// Public: kirim pesan dari form kontak
router.post('/api/kontak', async (req, res) => {
  try {
    const { nama, email, no_wa, pesan } = req.body;

    if (!nama || !email || !no_wa || !pesan) {
      res.status(400).json({ message: 'Nama, email, nomor WhatsApp, dan pesan wajib diisi.' });
      return;
    }

    const nomorWa = String(no_wa).replace(/[^\d+]/g, '').slice(0, 30);

    await runQuery(
      `INSERT INTO pesan_pengunjung (nama, email, no_wa, pesan) VALUES ($1, $2, $3, $4)`,
      [nama.trim(), email.trim(), nomorWa, pesan.trim()]
    );

    res.status(201).json({ message: 'Pesan berhasil dikirim.' });
  } catch (error) {
    res.status(500).json({ message: `Gagal menyimpan pesan: ${error.message}` });
  }
});

// Admin: lihat semua pesan
router.get('/api/admin/pesan', async (_req, res) => {
  try {
    const rows = await runQuery(
      `SELECT id, nama, email, no_wa, pesan, status_baca, created_at FROM pesan_pengunjung ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Gagal mengambil pesan: ${error.message}` });
  }
});

module.exports = router;
