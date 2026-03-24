-- Jalankan file ini di database PostgreSQL yang sudah Anda buat di pgAdmin.
-- Contoh: buat database bernama wisata_redisari, lalu buka Query Tool dan eksekusi file ini.

CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nama_lengkap VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paket_wisata (
  id SERIAL PRIMARY KEY,
  nama_paket VARCHAR(180) NOT NULL,
  harga_label VARCHAR(120) NOT NULL,
  deskripsi TEXT NOT NULL,
  detail_url VARCHAR(255) DEFAULT '#',
  gambar_url VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS galeri (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(160) NOT NULL,
  gambar_url VARCHAR(255) NOT NULL,
  kategori VARCHAR(20) NOT NULL DEFAULT 'galeri' CHECK (kategori IN ('galeri', 'fasilitas')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimoni (
  id SERIAL PRIMARY KEY,
  nama_pengunjung VARCHAR(120) NOT NULL,
  kota VARCHAR(120) NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  highlights VARCHAR(255) DEFAULT '',
  komentar TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pesan_pengunjung (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  no_wa VARCHAR(30),
  pesan TEXT NOT NULL,
  status_baca VARCHAR(20) NOT NULL DEFAULT 'baru' CHECK (status_baca IN ('baru', 'dibaca')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS pesan_pengunjung
ADD COLUMN IF NOT EXISTS no_wa VARCHAR(30);

CREATE TABLE IF NOT EXISTS fasilitas (
  id SERIAL PRIMARY KEY,
  nama_fasilitas VARCHAR(180) NOT NULL,
  deskripsi TEXT,
  gambar_url VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin (username, password, nama_lengkap)
SELECT 'admin', 'admin123', 'Admin Wisata Redisari'
WHERE NOT EXISTS (SELECT 1 FROM admin WHERE username = 'admin');

INSERT INTO paket_wisata (nama_paket, harga_label, deskripsi, detail_url, gambar_url)
SELECT 'Paket Jelajah Goa Asrep', 'Harga: Rp125.000 / orang', 'Jelajahi sungai bawah tanah Goa Asrep dengan pemandu berpengalaman.', '#', 'assets/gambar2.jpg'
WHERE NOT EXISTS (SELECT 1 FROM paket_wisata);

INSERT INTO testimoni (nama_pengunjung, kota, rating, highlights, komentar)
SELECT 'Budi', 'Kebumen', 5, 'Suasana tenang, Cocok untuk keluarga, Spot sunset bagus', 'Tempat terbaik untuk melepas penat sambil menikmati senja yang tenang.'
WHERE NOT EXISTS (SELECT 1 FROM testimoni);

INSERT INTO galeri (judul, gambar_url, kategori)
SELECT 'Panorama Alam', 'assets/gmbr1.jpg', 'galeri'
WHERE NOT EXISTS (SELECT 1 FROM galeri);

INSERT INTO fasilitas (nama_fasilitas, deskripsi, gambar_url)
SELECT 'Area Mushola & Tempat Wudhu', 'Terpisah pria/wanita dan bersih.', 'assets/gambar4.jpg'
WHERE NOT EXISTS (SELECT 1 FROM fasilitas);
