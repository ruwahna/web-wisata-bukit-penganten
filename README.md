# Wisata Goa Asrep & Bukit Penganten

Website wisata Desa Redisari, Kebumen — menampilkan informasi paket wisata, galeri, fasilitas, testimoni, dan form kontak pengunjung.

## Struktur Folder

```
├── public/            Frontend (HTML, CSS, JS, assets)
│   ├── css/           Stylesheet
│   ├── js/            Client-side JavaScript
│   └── assets/        Gambar statis & uploads
├── src/               Backend source code
│   ├── app.js         Express app setup
│   ├── config/db.js   Koneksi PostgreSQL
│   ├── middleware/     Multer upload config
│   └── routes/        API route modules
├── db/                Database scripts
│   ├── schema.sql     Struktur tabel
│   └── seed.sql       Data awal contoh
├── server.js          Entry point
└── .env               Konfigurasi environment
```

## Prasyarat

- **Node.js** >= 18
- **PostgreSQL** >= 14

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Buat database

Buka pgAdmin atau psql, lalu:

```sql
CREATE DATABASE wisata_redisari;
```

### 3. Jalankan schema & seed

```bash
psql -d wisata_redisari -f db/schema.sql
psql -d wisata_redisari -f db/seed.sql
```

### 4. Konfigurasi environment

Salin `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password_kamu
DB_NAME=wisata_redisari
```

### 5. Jalankan server

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

Buka browser ke `http://localhost:3000`

## Admin Panel

Akses admin panel di `http://localhost:3000/admin.html` untuk mengelola:
- Paket wisata
- Testimoni
- Galeri foto
- Fasilitas
- Pesan pengunjung

## API Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/health` | Health check |
| GET | `/api/paket` | Paket aktif (public) |
| GET | `/api/testimoni` | Testimoni aktif (public) |
| GET | `/api/galeri` | Galeri aktif (public) |
| POST | `/api/kontak` | Kirim pesan kontak |
| GET/POST/PUT/DELETE | `/api/admin/*` | Endpoint admin |
