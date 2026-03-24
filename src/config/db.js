const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD ?? ''),
  database: process.env.DB_NAME || 'wisata_redisari',
  max: 10,
});

const runQuery = async (sql, params = []) => {
  const { rows } = await pool.query(sql, params);
  return rows;
};

const runCommand = async (sql, params = []) => pool.query(sql, params);

/**
 * Coba koneksi ke database. Jika gagal, log warning tapi tidak crash.
 * @returns {Promise<boolean>} true jika berhasil connect
 */
const connectDb = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✓ Database terhubung.');
    return true;
  } catch (error) {
    console.error(`✗ Gagal koneksi database: ${error.message}`);
    console.error('  Pastikan PostgreSQL aktif dan database "wisata_redisari" sudah dibuat.');
    console.error('  Server tetap berjalan, tapi API yang butuh DB akan error.');
    return false;
  }
};

/**
 * Pastikan kolom-kolom baru sudah ada (backward compat).
 */
const ensureSchemaCompatibility = async () => {
  try {
    await runCommand(
      `ALTER TABLE pesan_pengunjung ADD COLUMN IF NOT EXISTS no_wa VARCHAR(30)`
    );
  } catch (_err) {
    // Abaikan jika tabel belum ada (user belum jalankan schema.sql)
  }
};

module.exports = { pool, runQuery, runCommand, connectDb, ensureSchemaCompatibility };
