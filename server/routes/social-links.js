import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all active social links (public)
router.get('/social-links', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM social_links WHERE status = "active" ORDER BY display_order ASC, created_at DESC'
    );
    res.json({ success: true, socialLinks: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all social links (admin only)
router.get('/admin/social-links', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM social_links ORDER BY display_order ASC, created_at DESC'
    );
    res.json({ success: true, socialLinks: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create social link (admin only)
router.post('/admin/social-links', requireAuth, async (req, res) => {
  try {
    const { platform_name, platform_url, icon_class, display_order, status } = req.body;

    const [result] = await db.query(
      `INSERT INTO social_links (platform_name, platform_url, icon_class, display_order, status, created_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [platform_name, platform_url, icon_class, display_order || 0, status || 'active', req.admin.id]
    );

    res.json({ success: true, message: 'Social link created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update social link (admin only)
router.put('/admin/social-links/:id', requireAuth, async (req, res) => {
  try {
    const { platform_name, platform_url, icon_class, display_order, status } = req.body;

    await db.query(
      `UPDATE social_links 
       SET platform_name = ?, platform_url = ?, icon_class = ?, display_order = ?, status = ? 
       WHERE id = ?`,
      [platform_name, platform_url, icon_class, display_order || 0, status || 'active', req.params.id]
    );

    res.json({ success: true, message: 'Social link updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete social link (admin only)
router.delete('/admin/social-links/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM social_links WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Social link deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
