const { Router } = require('express');
const { runQuery, runCommand } = require('../config/db');
const { upload, mapUploadPath } = require('../middleware/upload');

const router = Router();

// Admin: semua fasilitas
router.get('/api/admin/fasilitas', async (_req, res) => {
  try {
    const rows = await runQuery(
      `SELECT id, nama_fasilitas, deskripsi, gambar_url, is_active, created_at FROM fasilitas ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Gagal mengambil fasilitas: ${error.message}` });
  }
});

// Admin: tambah fasilitas
router.post('/api/admin/fasilitas', upload.single('gambar'), async (req, res) => {
  try {
    const { nama_fasilitas, deskripsi = '' } = req.body;

    if (!nama_fasilitas || !req.file) {
      res.status(400).json({ message: 'Nama fasilitas dan gambar wajib diisi.' });
      return;
    }

    await runQuery(
      `INSERT INTO fasilitas (nama_fasilitas, deskripsi, gambar_url) VALUES ($1, $2, $3)`,
      [nama_fasilitas.trim(), deskripsi.trim(), mapUploadPath(req.file)]
    );

    res.status(201).json({ message: 'Fasilitas berhasil ditambahkan.' });
  } catch (error) {
    res.status(500).json({ message: `Gagal upload fasilitas: ${error.message}` });
  }
});

// Admin: hapus fasilitas
router.delete('/api/admin/fasilitas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await runCommand(`DELETE FROM fasilitas WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Data fasilitas tidak ditemukan.' });
      return;
    }

    res.json({ message: 'Data fasilitas berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: `Gagal menghapus fasilitas: ${error.message}` });
  }
});

module.exports = router;
