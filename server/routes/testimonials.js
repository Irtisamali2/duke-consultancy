import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/testimonials'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'testimonial-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all active testimonials (public)
router.get('/testimonials', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM testimonials WHERE status = "active" ORDER BY display_order ASC, created_at DESC'
    );
    res.json({ success: true, testimonials: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all testimonials (admin only)
router.get('/admin/testimonials', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM testimonials ORDER BY display_order ASC, created_at DESC'
    );
    res.json({ success: true, testimonials: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create testimonial (admin only)
router.post('/admin/testimonials', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, role, testimonial_text, display_order, status } = req.body;
    const image_url = req.file ? `/uploads/testimonials/${req.file.filename}` : null;

    const [result] = await db.query(
      `INSERT INTO testimonials (name, role, image_url, testimonial_text, display_order, status, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, role, image_url, testimonial_text, display_order || 0, status || 'active', req.admin.id]
    );

    res.json({ success: true, message: 'Testimonial created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update testimonial (admin only)
router.put('/admin/testimonials/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, role, testimonial_text, display_order, status, existing_image_url } = req.body;
    let image_url;
    
    // If a new file is uploaded, use it
    if (req.file) {
      image_url = `/uploads/testimonials/${req.file.filename}`;
    } else if (existing_image_url) {
      // If no new file but existing_image_url provided, keep it
      image_url = existing_image_url;
    } else {
      // Otherwise, fetch current image_url from database to preserve it
      const [[current]] = await db.query('SELECT image_url FROM testimonials WHERE id = ?', [req.params.id]);
      image_url = current?.image_url || null;
    }

    await db.query(
      `UPDATE testimonials 
       SET name = ?, role = ?, image_url = ?, testimonial_text = ?, display_order = ?, status = ? 
       WHERE id = ?`,
      [name, role, image_url, testimonial_text, display_order || 0, status || 'active', req.params.id]
    );

    res.json({ success: true, message: 'Testimonial updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete testimonial (admin only)
router.delete('/admin/testimonials/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
