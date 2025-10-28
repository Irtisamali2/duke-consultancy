import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/trades', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(trades, CONCAT('$[', idx, ']'))) as trade
      FROM jobs
      CROSS JOIN (
        SELECT 0 as idx UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
        UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
      ) indices
      WHERE JSON_LENGTH(trades) > idx
        AND trades IS NOT NULL
    `);
    
    const uniqueTrades = [...new Set(rows.map(r => r.trade).filter(Boolean))];
    res.json({ success: true, trades: uniqueTrades.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/trades', requireAuth, async (req, res) => {
  try {
    const { trade } = req.body;
    
    if (!trade || trade.trim() === '') {
      return res.status(400).json({ success: false, message: 'Trade name is required' });
    }
    
    res.json({ success: true, message: 'Trade can be used in job creation', trade });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
