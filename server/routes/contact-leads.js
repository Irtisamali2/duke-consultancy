import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Create new contact lead (public - from contact form)
router.post('/contact-leads', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required' 
      });
    }

    const [result] = await db.query(
      `INSERT INTO contact_leads (name, email, phone, message, status) 
       VALUES (?, ?, ?, ?, 'new')`,
      [name, email, phone || null, message]
    );

    res.json({ success: true, message: 'Your message has been sent successfully!', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all contact leads (admin only)
router.get('/admin/contact-leads', requireAuth, async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = 'SELECT * FROM contact_leads WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR message LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    res.json({ success: true, leads: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update lead status (admin only)
router.put('/admin/contact-leads/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    await db.query(
      'UPDATE contact_leads SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    res.json({ success: true, message: 'Lead status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete lead (admin only)
router.delete('/admin/contact-leads/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM contact_leads WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
