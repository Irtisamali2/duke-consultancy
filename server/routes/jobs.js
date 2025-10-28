import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

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
      countries, trades, max_countries_selectable, max_trades_selectable
    } = req.body;
    
    const countriesJson = countries ? JSON.stringify(countries) : JSON.stringify([country]);
    const tradesJson = trades ? JSON.stringify(trades) : JSON.stringify([specialization]);
    
    const [result] = await db.query(
      `INSERT INTO jobs (
        title, description, location, country, job_type, specialization, 
        experience_required, salary_range, status, created_by,
        countries, trades, max_countries_selectable, max_trades_selectable
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, description, location, 
        countries && countries.length > 0 ? countries.join(', ') : country,
        job_type, 
        trades && trades.length > 0 ? trades.join(', ') : specialization,
        experience_required, salary_range, status || 'active', req.admin.id,
        countriesJson, tradesJson, 
        max_countries_selectable || 1, 
        max_trades_selectable || 1
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
      countries, trades, max_countries_selectable, max_trades_selectable
    } = req.body;
    
    const countriesJson = countries ? JSON.stringify(countries) : JSON.stringify([country]);
    const tradesJson = trades ? JSON.stringify(trades) : JSON.stringify([specialization]);
    
    await db.query(
      `UPDATE jobs SET 
        title = ?, description = ?, location = ?, country = ?, job_type = ?, 
        specialization = ?, experience_required = ?, salary_range = ?, status = ?,
        countries = ?, trades = ?, max_countries_selectable = ?, max_trades_selectable = ?
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
