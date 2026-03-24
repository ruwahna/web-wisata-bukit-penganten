-- ============================================================
-- Seed Data: Data awal contoh
-- ============================================================
-- Jalankan SETELAH schema.sql:
--   psql -d wisata_redisari -f db/seed.sql
-- ============================================================

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
