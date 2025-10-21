import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/healthcare-profiles', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id as candidate_id,
        c.email,
        c.status,
        hp.first_name,
        hp.last_name,
        hp.mobile_no,
        hp.passport_number,
        hp.trade_applied_for,
        hp.date_of_birth,
        (SELECT GROUP_CONCAT(degree_diploma_title SEPARATOR ', ') FROM education_records WHERE candidate_id = c.id) as education,
        (SELECT SUM(CAST(SUBSTRING_INDEX(total_experience, ' ', 1) AS UNSIGNED)) FROM work_experience WHERE candidate_id = c.id) as total_experience
      FROM candidates c
      LEFT JOIN healthcare_profiles hp ON c.id = hp.candidate_id
      ORDER BY c.created_at DESC
    `);
    res.json({ success: true, profiles: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/healthcare-profiles/:id', requireAuth, async (req, res) => {
  try {
    const [candidateRows] = await db.query('SELECT * FROM candidates WHERE id = ?', [req.params.id]);
    
    if (candidateRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const [profileRows] = await db.query('SELECT * FROM healthcare_profiles WHERE candidate_id = ?', [req.params.id]);
    const [educationRows] = await db.query('SELECT * FROM education_records WHERE candidate_id = ?', [req.params.id]);
    const [experienceRows] = await db.query('SELECT * FROM work_experience WHERE candidate_id = ?', [req.params.id]);
    const [documentsRows] = await db.query('SELECT * FROM candidate_documents WHERE candidate_id = ?', [req.params.id]);

    res.json({
      success: true,
      candidate: candidateRows[0],
      profile: profileRows[0] || {},
      education: educationRows,
      experience: experienceRows,
      documents: documentsRows[0] || {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
