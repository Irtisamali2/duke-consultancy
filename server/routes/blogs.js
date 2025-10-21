import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

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

router.get('/blogs/:id', requireAuth, async (req, res) => {
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
    const { title, content, author, category, tags, status } = req.body;
    
    const publishedDate = status === 'published' ? new Date() : null;
    
    const [result] = await db.query(
      `INSERT INTO blogs (title, content, author, category, tags, status, created_by, published_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, content, author, category, tags, status || 'draft', req.admin.id, publishedDate]
    );
    
    res.json({ success: true, message: 'Blog created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/blogs/:id', requireAuth, async (req, res) => {
  try {
    const { title, content, author, category, tags, status } = req.body;
    
    const [currentRows] = await db.query('SELECT status FROM blogs WHERE id = ?', [req.params.id]);
    const currentStatus = currentRows[0]?.status;
    
    const publishedDate = (status === 'published' && currentStatus !== 'published') ? new Date() : undefined;
    
    if (publishedDate !== undefined) {
      await db.query(
        `UPDATE blogs SET title = ?, content = ?, author = ?, category = ?, tags = ?, status = ?, published_date = ? WHERE id = ?`,
        [title, content, author, category, tags, status, publishedDate, req.params.id]
      );
    } else {
      await db.query(
        `UPDATE blogs SET title = ?, content = ?, author = ?, category = ?, tags = ?, status = ? WHERE id = ?`,
        [title, content, author, category, tags, status, req.params.id]
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
