import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all company settings (public)
router.get('/company-settings', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM company_settings ORDER BY setting_key');
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update company settings (admin only)
router.put('/company-settings', requireAuth, async (req, res) => {
  try {
    const settings = req.body;
    
    for (const [key, value] of Object.entries(settings)) {
      await db.query(
        `INSERT INTO company_settings (setting_key, setting_value, updated_by) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE setting_value = ?, updated_by = ?`,
        [key, value, req.admin.id, value, req.admin.id]
      );
    }
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
