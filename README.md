# Web Wisata Bukit Penganten - Backend + Admin

## Fitur yang sudah ditambahkan

- Struktur database rapi dengan tabel:
  - `admin`
  - `paket_wisata`
  - `galeri`
  - `testimoni`
  - `pesan_pengunjung`
  - `fasilitas`
- Form kontak terhubung ke database (`pesan_pengunjung`).
- Dashboard admin untuk:
  - CRUD paket wisata (Create, Read, Update, Delete)
  - lihat pesan pengunjung
  - upload gambar galeri
  - upload gambar fasilitas
- Upload gambar paket wisata.
- Optimasi frontend:
  - lazy loading gambar
  - async decoding gambar
  - admin panel responsif (mobile + desktop)

## Struktur file baru

- `server.js` -> Backend API Express + PostgreSQL + upload
- `admin.html` -> Halaman dashboard admin
- `admin.js` -> Logic CRUD/upload admin
- `kontak.js` -> Submit form kontak ke API
- `paket.js` -> Ambil data paket dari API publik

## Setup

1. Install Node.js LTS.
2. Jalankan:

```bash
npm install
```

3. Buat file `.env` dari `.env.example` lalu sesuaikan koneksi PostgreSQL.
4. Import schema di pgAdmin:
  - Buat database `wisata_redisari`
  - Buka database tersebut di pgAdmin
  - Buka Query Tool
  - Jalankan isi file `schema.sql`

5. Jalankan server:

```bash
npm start
```

6. Buka:
- Frontend: `http://localhost:3000`
- Admin: `http://localhost:3000/admin.html`

## Endpoint utama

- `POST /api/kontak` -> simpan pesan kontak
- `GET /api/admin/pesan` -> list pesan pengunjung
- `GET /api/admin/paket` -> list paket admin
- `POST /api/admin/paket` -> tambah paket + upload gambar
- `PUT /api/admin/paket/:id` -> edit paket
- `DELETE /api/admin/paket/:id` -> hapus paket
- `GET /api/admin/galeri` -> list galeri
- `POST /api/admin/galeri` -> upload gambar galeri
- `DELETE /api/admin/galeri/:id` -> hapus gambar galeri
- `GET /api/admin/fasilitas` -> list fasilitas
- `POST /api/admin/fasilitas` -> upload gambar fasilitas
- `DELETE /api/admin/fasilitas/:id` -> hapus fasilitas
- `GET /api/paket` -> paket publik aktif untuk halaman paket

## Checklist testing

1. Tombol berfungsi:
- Cek submit form di admin (paket/galeri/fasilitas)
- Cek tombol edit/hapus paket

2. Data tersimpan:
- Setelah submit, cek tabel PostgreSQL terkait di pgAdmin

3. Gambar muncul:
- Cek thumbnail di admin
- Cek halaman paket menampilkan gambar hasil upload

4. Form kontak masuk admin:
- Isi form di halaman kontak
- Pastikan muncul di tabel pesan pada admin

5. Responsive:
- Cek tampilan `admin.html` di HP dan laptop

6. Performa:
- Semua gambar sudah `loading="lazy"` dan `decoding="async"`
- Ukuran upload dibatasi maksimal 5MB per gambar
