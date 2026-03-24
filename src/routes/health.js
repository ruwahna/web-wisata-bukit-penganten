const { Router } = require('express');
const { runQuery } = require('../config/db');

const router = Router();

router.get('/api/health', async (_req, res) => {
  try {
    await runQuery('SELECT 1');
    res.json({ ok: true, message: 'API aktif dan database terhubung.' });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Database error: ${error.message}` });
  }
});

module.exports = router;
