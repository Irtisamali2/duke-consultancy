import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all categories (public)
router.get('/blog-categories', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM blog_categories ORDER BY name ASC
    `);
    res.json({ success: true, categories: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new category (admin only)
router.post('/blog-categories', requireAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const [result] = await db.query(
      `INSERT INTO blog_categories (name, slug, description, created_by) VALUES (?, ?, ?, ?)`,
      [name, slug, description, req.admin.id]
    );
    
    res.json({ success: true, message: 'Category created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete category (admin only)
router.delete('/blog-categories/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM blog_categories WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
