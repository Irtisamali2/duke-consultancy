import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const { title, content, excerpt, featured_image, author, category, categories, tags, status } = req.body;
    
    const publishedDate = status === 'published' ? new Date() : null;
    const now = new Date();
    
    // Handle both single category and multiple categories
    const categoriesValue = categories || category || '';
    const tagsValue = tags || '';
    
    const [result] = await db.query(
      `INSERT INTO blogs (title, content, excerpt, featured_image, author, category, categories, tags, status, created_by, published_date, modified_at, modified_by, modified_by_type) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin')`,
      [title, content, excerpt, featured_image, author, category || '', categoriesValue, tagsValue, status || 'draft', req.admin.id, publishedDate, now, req.admin.id]
    );
    
    res.json({ success: true, message: 'Blog created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/blogs/:id', requireAuth, async (req, res) => {
  try {
    const { title, content, excerpt, featured_image, author, category, categories, tags, status } = req.body;
    
    const [currentRows] = await db.query('SELECT status FROM blogs WHERE id = ?', [req.params.id]);
    const currentStatus = currentRows[0]?.status;
    
    const publishedDate = (status === 'published' && currentStatus !== 'published') ? new Date() : undefined;
    const now = new Date();
    
    // Handle both single category and multiple categories
    const categoriesValue = categories || category || '';
    const tagsValue = tags || '';
    
    if (publishedDate !== undefined) {
      await db.query(
        `UPDATE blogs SET title = ?, content = ?, excerpt = ?, featured_image = ?, author = ?, category = ?, categories = ?, tags = ?, status = ?, published_date = ?, modified_at = ?, modified_by = ?, modified_by_type = 'admin' WHERE id = ?`,
        [title, content, excerpt, featured_image, author, category || '', categoriesValue, tagsValue, status, publishedDate, now, req.admin.id, req.params.id]
      );
    } else {
      await db.query(
        `UPDATE blogs SET title = ?, content = ?, excerpt = ?, featured_image = ?, author = ?, category = ?, categories = ?, tags = ?, status = ?, modified_at = ?, modified_by = ?, modified_by_type = 'admin' WHERE id = ?`,
        [title, content, excerpt, featured_image, author, category || '', categoriesValue, tagsValue, status, now, req.admin.id, req.params.id]
      );
    }
    
    res.json({ success: true, message: 'Blog updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/blogs/:id', requireAuth, async (req, res) => {
  try {
    // Fetch blog to get associated image file
    const [rows] = await db.query('SELECT featured_image FROM blogs WHERE id = ?', [req.params.id]);
    
    if (rows.length > 0 && rows[0].featured_image) {
      const imageUrl = rows[0].featured_image;
      
      // Check if it's a locally uploaded file (starts with /uploads/)
      if (imageUrl.startsWith('/uploads/')) {
        // Strip leading slash to make it a relative path
        const relativePath = imageUrl.substring(1); // Remove leading /
        const filePath = path.join(__dirname, '..', relativePath);
        
        // Delete the file if it exists
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted image file: ${filePath}`);
          } catch (fileError) {
            console.error(`Failed to delete file ${filePath}:`, fileError);
            // Continue with blog deletion even if file deletion fails
          }
        } else {
          console.log(`File not found for deletion: ${filePath}`);
        }
      }
    }
    
    // Delete the blog from database
    await db.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
