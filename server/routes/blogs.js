import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Public endpoint - get published blogs
router.get('/blogs/published', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, a.name as author_name 
      FROM blogs b 
      LEFT JOIN admins a ON b.created_by = a.id 
      WHERE b.status = 'published'
      ORDER BY b.published_date DESC
    `);
    res.json({ success: true, blogs: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin endpoint - get all blogs
router.get('/blogs', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, a.name as author_name 
      FROM blogs b 
      LEFT JOIN admins a ON b.created_by = a.id 
      ORDER BY b.created_at DESC
    `);
    res.json({ success: true, blogs: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public endpoint - get single published blog
router.get('/blogs/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, a.name as author_name 
      FROM blogs b 
      LEFT JOIN admins a ON b.created_by = a.id 
      WHERE b.id = ? AND b.status = 'published'
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, blog: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin endpoint - get single blog (including drafts)
router.get('/blogs/admin/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, blog: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/blogs', requireAuth, async (req, res) => {
  try {
    const { title, content, excerpt, featured_image, author, category, tags, status } = req.body;
    
    const publishedDate = status === 'published' ? new Date() : null;
    
    const [result] = await db.query(
      `INSERT INTO blogs (title, content, excerpt, featured_image, author, category, tags, status, created_by, published_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, content, excerpt, featured_image, author, category, tags, status || 'draft', req.admin.id, publishedDate]
    );
    
    res.json({ success: true, message: 'Blog created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/blogs/:id', requireAuth, async (req, res) => {
  try {
    const { title, content, excerpt, featured_image, author, category, tags, status } = req.body;
    
    const [currentRows] = await db.query('SELECT status FROM blogs WHERE id = ?', [req.params.id]);
    const currentStatus = currentRows[0]?.status;
    
    const publishedDate = (status === 'published' && currentStatus !== 'published') ? new Date() : undefined;
    
    if (publishedDate !== undefined) {
      await db.query(
        `UPDATE blogs SET title = ?, content = ?, excerpt = ?, featured_image = ?, author = ?, category = ?, tags = ?, status = ?, published_date = ? WHERE id = ?`,
        [title, content, excerpt, featured_image, author, category, tags, status, publishedDate, req.params.id]
      );
    } else {
      await db.query(
        `UPDATE blogs SET title = ?, content = ?, excerpt = ?, featured_image = ?, author = ?, category = ?, tags = ?, status = ? WHERE id = ?`,
        [title, content, excerpt, featured_image, author, category, tags, status, req.params.id]
      );
    }
    
    res.json({ success: true, message: 'Blog updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/blogs/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
