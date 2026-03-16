const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

const uploadDir = path.join(__dirname, 'assets', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD ?? ''),
  database: process.env.DB_NAME || 'wisata_redisari',
  max: 10,
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 40);

    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Hanya file gambar yang diizinkan.'));
      return;
    }

    cb(null, true);
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));
app.use(express.static(__dirname));

const runQuery = async (sql, params = []) => {
  const { rows } = await pool.query(sql, params);
  return rows;
};

const runCommand = async (sql, params = []) => pool.query(sql, params);

const mapUploadPath = (file) => {
  if (!file) return '';
  return `uploads/${file.filename}`;
};

app.get('/api/health', async (_req, res) => {
  try {
    await runQuery('SELECT 1');
    res.json({ ok: true, message: 'API aktif dan database terhubung.' });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Database error: ${error.message}` });
  }
});

app.post('/api/kontak', async (req, res) => {
  try {
    const { nama, email, pesan } = req.body;

    if (!nama || !email || !pesan) {
      res.status(400).json({ message: 'Nama, email, dan pesan wajib diisi.' });
      return;
    }

    await runQuery(
      `INSERT INTO pesan_pengunjung (nama, email, pesan) VALUES ($1, $2, $3)`,
      [nama.trim(), email.trim(), pesan.trim()]
    );

    res.status(201).json({ message: 'Pesan berhasil dikirim.' });
  } catch (error) {
    res.status(500).json({ message: `Gagal menyimpan pesan: ${error.message}` });
  }
});

app.get('/api/admin/pesan', async (_req, res) => {
  try {
    const rows = await runQuery(
      `SELECT id, nama, email, pesan, status_baca, created_at FROM pesan_pengunjung ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Gagal mengambil pesan: ${error.message}` });
  }
});

app.get('/api/admin/paket', async (_req, res) => {
  try {
    const rows = await runQuery(
      `SELECT id, nama_paket, harga_label, deskripsi, detail_url, gambar_url, is_active, created_at FROM paket_wisata ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Gagal mengambil paket: ${error.message}` });
  }
});

app.get('/api/paket', async (_req, res) => {
  try {
    const rows = await runQuery(
      `SELECT id, nama_paket, harga_label, deskripsi, detail_url, gambar_url FROM paket_wisata WHERE is_active = TRUE ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Gagal mengambil paket publik: ${error.message}` });
  }
});

app.post('/api/admin/paket', upload.single('gambar'), async (req, res) => {
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

app.put('/api/admin/paket/:id', upload.single('gambar'), async (req, res) => {
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

app.delete('/api/admin/paket/:id', async (req, res) => {
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

app.get('/api/admin/galeri', async (_req, res) => {
  try {
    const rows = await runQuery(
      `SELECT id, judul, gambar_url, kategori, is_active, created_at FROM galeri ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Gagal mengambil galeri: ${error.message}` });
  }
});

app.post('/api/admin/galeri', upload.single('gambar'), async (req, res) => {
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

app.delete('/api/admin/galeri/:id', async (req, res) => {
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

app.get('/api/admin/fasilitas', async (_req, res) => {
  try {
    const rows = await runQuery(
      `SELECT id, nama_fasilitas, deskripsi, gambar_url, is_active, created_at FROM fasilitas ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Gagal mengambil fasilitas: ${error.message}` });
  }
});

app.post('/api/admin/fasilitas', upload.single('gambar'), async (req, res) => {
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

app.delete('/api/admin/fasilitas/:id', async (req, res) => {
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

app.use((err, _req, res, _next) => {
  res.status(400).json({ message: err.message || 'Terjadi kesalahan.' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
