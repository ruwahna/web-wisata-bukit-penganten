-- ============================================================
-- Schema Database: Wisata Goa Asrep & Bukit Penganten
-- ============================================================
-- Cara pakai:
--   1. Buat database di pgAdmin: CREATE DATABASE wisata_redisari;
--   2. Buka Query Tool pada database wisata_redisari
--   3. Jalankan file ini: \i db/schema.sql
-- ============================================================

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

CREATE TABLE IF NOT EXISTS fasilitas (
  id SERIAL PRIMARY KEY,
  nama_fasilitas VARCHAR(180) NOT NULL,
  deskripsi TEXT,
  gambar_url VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Backward compatibility
ALTER TABLE IF EXISTS pesan_pengunjung
ADD COLUMN IF NOT EXISTS no_wa VARCHAR(30);
