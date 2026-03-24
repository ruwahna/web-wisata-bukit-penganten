const { Router } = require('express');
const { runQuery, runCommand } = require('../config/db');

const router = Router();

// Public: testimoni aktif
router.get('/api/testimoni', async (_req, res) => {
  try {
    const rows = await runQuery(
      `SELECT id, nama_pengunjung, kota, rating, highlights, komentar FROM testimoni WHERE is_active = TRUE ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Gagal mengambil testimoni publik: ${error.message}` });
  }
});

// Admin: semua testimoni
router.get('/api/admin/testimoni', async (_req, res) => {
  try {
    const rows = await runQuery(
      `SELECT id, nama_pengunjung, kota, rating, highlights, komentar, is_active, created_at FROM testimoni ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Gagal mengambil testimoni: ${error.message}` });
  }
});

// Admin: tambah testimoni
router.post('/api/admin/testimoni', async (req, res) => {
  try {
    const {
      nama_pengunjung,
      kota,
      rating = 5,
      highlights = '',
      komentar,
    } = req.body;

    if (!nama_pengunjung || !kota || !komentar) {
      res.status(400).json({ message: 'Nama pengunjung, kota, dan komentar wajib diisi.' });
      return;
    }

    await runQuery(
      `INSERT INTO testimoni (nama_pengunjung, kota, rating, highlights, komentar) VALUES ($1, $2, $3, $4, $5)`,
      [
        nama_pengunjung.trim(),
        kota.trim(),
        Math.max(1, Math.min(5, Number(rating) || 5)),
        String(highlights || '').trim(),
        komentar.trim(),
      ]
    );

    res.status(201).json({ message: 'Testimoni berhasil ditambahkan.' });
  } catch (error) {
    res.status(500).json({ message: `Gagal menambah testimoni: ${error.message}` });
  }
});

// Admin: hapus testimoni
router.delete('/api/admin/testimoni/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await runCommand(`DELETE FROM testimoni WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Testimoni tidak ditemukan.' });
      return;
    }

    res.json({ message: 'Testimoni berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: `Gagal menghapus testimoni: ${error.message}` });
  }
});

module.exports = router;
