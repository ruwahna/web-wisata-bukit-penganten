const { Router } = require('express');
const { runQuery, runCommand } = require('../config/db');
const { upload, mapUploadPath } = require('../middleware/upload');

const router = Router();

// Public: paket aktif
router.get('/api/paket', async (_req, res) => {
  try {
    const rows = await runQuery(
      `SELECT id, nama_paket, harga_label, deskripsi, detail_url, gambar_url FROM paket_wisata WHERE is_active = TRUE ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Gagal mengambil paket publik: ${error.message}` });
  }
});

// Admin: semua paket
router.get('/api/admin/paket', async (_req, res) => {
  try {
    const rows = await runQuery(
      `SELECT id, nama_paket, harga_label, deskripsi, detail_url, gambar_url, is_active, created_at FROM paket_wisata ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Gagal mengambil paket: ${error.message}` });
  }
});

// Admin: tambah paket
router.post('/api/admin/paket', upload.single('gambar'), async (req, res) => {
  try {
    const { nama_paket, harga_label, deskripsi, detail_url = '#' } = req.body;

    if (!nama_paket || !harga_label || !deskripsi || !req.file) {
      res.status(400).json({ message: 'Nama paket, harga, deskripsi, dan gambar wajib diisi.' });
      return;
    }

    await runQuery(
      `INSERT INTO paket_wisata (nama_paket, harga_label, deskripsi, detail_url, gambar_url) VALUES ($1, $2, $3, $4, $5)`,
      [nama_paket.trim(), harga_label.trim(), deskripsi.trim(), detail_url.trim() || '#', mapUploadPath(req.file)]
    );

    res.status(201).json({ message: 'Paket wisata berhasil ditambahkan.' });
  } catch (error) {
    res.status(500).json({ message: `Gagal menambah paket: ${error.message}` });
  }
});

// Admin: update paket
router.put('/api/admin/paket/:id', upload.single('gambar'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_paket, harga_label, deskripsi, detail_url = '#', is_active = 1 } = req.body;

    const rows = await runQuery(`SELECT gambar_url FROM paket_wisata WHERE id = $1`, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Paket tidak ditemukan.' });
      return;
    }

    const gambarUrl = req.file ? mapUploadPath(req.file) : rows[0].gambar_url;

    await runQuery(
      `UPDATE paket_wisata SET nama_paket = $1, harga_label = $2, deskripsi = $3, detail_url = $4, gambar_url = $5, is_active = $6 WHERE id = $7`,
      [
        (nama_paket || '').trim(),
        (harga_label || '').trim(),
        (deskripsi || '').trim(),
        (detail_url || '#').trim(),
        gambarUrl,
        Boolean(Number(is_active)),
        id,
      ]
    );

    res.json({ message: 'Paket wisata berhasil diperbarui.' });
  } catch (error) {
    res.status(500).json({ message: `Gagal memperbarui paket: ${error.message}` });
  }
});

// Admin: hapus paket
router.delete('/api/admin/paket/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await runCommand(`DELETE FROM paket_wisata WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Paket tidak ditemukan.' });
      return;
    }

    res.json({ message: 'Paket wisata berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: `Gagal menghapus paket: ${error.message}` });
  }
});

module.exports = router;
