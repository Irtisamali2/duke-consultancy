import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ 
      success: true, 
      message: 'Database connection successful!',
      result: rows[0].result,
      database: process.env.DB_NAME
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

router.get('/check-tables', async (req, res) => {
  try {
    const [tables] = await db.query('SHOW TABLES');
    res.json({ 
      success: true, 
      message: 'Tables retrieved successfully',
      tables: tables
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve tables',
      error: error.message 
    });
  }
});

export default router;
