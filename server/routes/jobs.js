import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/jobs/public', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, title, description, location, country, job_type, specialization, 
             experience_required, salary_range, status, countries, trades, 
             max_countries_selectable, max_trades_selectable, created_at, active_from, active_to
      FROM jobs 
      WHERE status = 'active'
        AND (
          (active_from IS NULL AND active_to IS NULL)
          OR (active_from IS NULL AND CURDATE() <= active_to)
          OR (active_to IS NULL AND CURDATE() >= active_from)
          OR (CURDATE() BETWEEN active_from AND active_to)
        )
      ORDER BY created_at DESC
    `);
    res.json({ success: true, jobs: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/jobs/public/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, title, description, location, country, job_type, specialization, 
             experience_required, salary_range, status, countries, trades, 
             max_countries_selectable, max_trades_selectable, created_at, active_from, active_to
      FROM jobs 
      WHERE id = ? 
        AND status = 'active'
        AND (
          (active_from IS NULL AND active_to IS NULL)
          OR (active_from IS NULL AND CURDATE() <= active_to)
          OR (active_to IS NULL AND CURDATE() >= active_from)
          OR (CURDATE() BETWEEN active_from AND active_to)
        )
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, job: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/jobs', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT j.*, a.name as created_by_name 
      FROM jobs j 
      LEFT JOIN admins a ON j.created_by = a.id 
      ORDER BY j.created_at DESC
    `);
    res.json({ success: true, jobs: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/jobs/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, job: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/jobs', requireAuth, async (req, res) => {
  try {
    const { 
      title, description, location, country, job_type, specialization, 
      experience_required, salary_range, status,
      countries, trades, max_countries_selectable, max_trades_selectable,
      active_from, active_to
    } = req.body;

    // Validate date range
    if (active_from && active_to && new Date(active_from) > new Date(active_to)) {
      return res.status(400).json({ success: false, message: 'Active from date cannot be after active to date' });
    }

    // Prevent activating job if active_to date has passed (compare dates only, not timestamps)
    if (status === 'active' && active_to) {
      const endDate = new Date(active_to);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      if (endDate < new Date()) {
        return res.status(400).json({ success: false, message: 'Cannot set status to active: end date has passed' });
      }
    }
    
    const countriesJson = countries ? JSON.stringify(countries) : JSON.stringify([country]);
    const tradesJson = trades ? JSON.stringify(trades) : JSON.stringify([specialization]);
    
    const [result] = await db.query(
      `INSERT INTO jobs (
        title, description, location, country, job_type, specialization, 
        experience_required, salary_range, status, created_by,
        countries, trades, max_countries_selectable, max_trades_selectable,
        active_from, active_to
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, description, location, 
        countries && countries.length > 0 ? countries.join(', ') : country,
        job_type, 
        trades && trades.length > 0 ? trades.join(', ') : specialization,
        experience_required, salary_range, status || 'active', req.admin.id,
        countriesJson, tradesJson, 
        max_countries_selectable || 1, 
        max_trades_selectable || 1,
        active_from || null,
        active_to || null
      ]
    );
    
    res.json({ success: true, message: 'Job created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/jobs/:id', requireAuth, async (req, res) => {
  try {
    const { 
      title, description, location, country, job_type, specialization, 
      experience_required, salary_range, status,
      countries, trades, max_countries_selectable, max_trades_selectable,
      active_from, active_to
    } = req.body;

    // Validate date range
    if (active_from && active_to && new Date(active_from) > new Date(active_to)) {
      return res.status(400).json({ success: false, message: 'Active from date cannot be after active to date' });
    }

    // Prevent activating job if active_to date has passed (compare dates only, not timestamps)
    if (status === 'active' && active_to) {
      const endDate = new Date(active_to);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      if (endDate < new Date()) {
        return res.status(400).json({ success: false, message: 'Cannot set status to active: end date has passed' });
      }
    }
    
    const countriesJson = countries ? JSON.stringify(countries) : JSON.stringify([country]);
    const tradesJson = trades ? JSON.stringify(trades) : JSON.stringify([specialization]);
    
    await db.query(
      `UPDATE jobs SET 
        title = ?, description = ?, location = ?, country = ?, job_type = ?, 
        specialization = ?, experience_required = ?, salary_range = ?, status = ?,
        countries = ?, trades = ?, max_countries_selectable = ?, max_trades_selectable = ?,
        active_from = ?, active_to = ?
      WHERE id = ?`,
      [
        title, description, location, 
        countries && countries.length > 0 ? countries.join(', ') : country,
        job_type, 
        trades && trades.length > 0 ? trades.join(', ') : specialization,
        experience_required, salary_range, status,
        countriesJson, tradesJson, 
        max_countries_selectable || 1, 
        max_trades_selectable || 1,
        active_from || null,
        active_to || null,
        req.params.id
      ]
    );
    
    res.json({ success: true, message: 'Job updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/jobs/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
