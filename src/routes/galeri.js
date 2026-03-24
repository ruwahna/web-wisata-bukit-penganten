const { Router } = require('express');
const { runQuery, runCommand } = require('../config/db');
const { upload, mapUploadPath } = require('../middleware/upload');

const router = Router();

// Public: galeri aktif (filter by kategori)
router.get('/api/galeri', async (req, res) => {
  try {
    const kategori = req.query.kategori === 'fasilitas' ? 'fasilitas' : 'galeri';
    const rows = await runQuery(
      `SELECT id, judul, gambar_url, kategori FROM galeri WHERE is_active = TRUE AND kategori = $1 ORDER BY created_at DESC`,
      [kategori]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Gagal mengambil galeri publik: ${error.message}` });
  }
});

// Admin: semua galeri
router.get('/api/admin/galeri', async (_req, res) => {
  try {
    const rows = await runQuery(
      `SELECT id, judul, gambar_url, kategori, is_active, created_at FROM galeri ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Gagal mengambil galeri: ${error.message}` });
  }
});

// Admin: upload gambar galeri
router.post('/api/admin/galeri', upload.single('gambar'), async (req, res) => {
  try {
    const { judul, kategori = 'galeri' } = req.body;

    if (!judul || !req.file) {
      res.status(400).json({ message: 'Judul dan gambar wajib diisi.' });
      return;
    }

    const safeKategori = kategori === 'fasilitas' ? 'fasilitas' : 'galeri';

    await runQuery(
      `INSERT INTO galeri (judul, gambar_url, kategori) VALUES ($1, $2, $3)`,
      [judul.trim(), mapUploadPath(req.file), safeKategori]
    );

    res.status(201).json({ message: 'Gambar berhasil diupload ke galeri.' });
  } catch (error) {
    res.status(500).json({ message: `Gagal upload galeri: ${error.message}` });
  }
});

// Admin: hapus galeri
router.delete('/api/admin/galeri/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await runCommand(`DELETE FROM galeri WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Data galeri tidak ditemukan.' });
      return;
    }

    res.json({ message: 'Data galeri berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: `Gagal menghapus galeri: ${error.message}` });
  }
});

module.exports = router;
