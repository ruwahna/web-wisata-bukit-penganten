require('dotenv').config();

const app = require('./src/app');
const { connectDb, ensureSchemaCompatibility } = require('./src/config/db');

const PORT = Number(process.env.PORT || 3000);

const startServer = async () => {
  // Coba koneksi DB, tapi server tetap jalan meski DB gagal
  const dbOk = await connectDb();

  if (dbOk) {
    await ensureSchemaCompatibility();
  }

  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    if (!dbOk) {
      console.log('⚠  Server aktif TANPA database. Perbaiki koneksi DB lalu restart.');
    }
  });
};

startServer();
