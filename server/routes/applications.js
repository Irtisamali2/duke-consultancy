import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/applications', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.*,
        c.email,
        hp.first_name,
        hp.last_name,
        hp.mobile_no,
        j.title as job_title
      FROM applications a
      LEFT JOIN candidates c ON a.candidate_id = c.id
      LEFT JOIN healthcare_profiles hp ON c.id = hp.candidate_id
      LEFT JOIN jobs j ON a.job_id = j.id
      ORDER BY a.applied_date DESC
    `);
    res.json({ success: true, applications: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/applications/:id', requireAuth, async (req, res) => {
  try {
    const [appRows] = await db.query(`
      SELECT a.*, j.title as job_title, j.location, j.country
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE a.id = ?
    `, [req.params.id]);
    
    if (appRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const application = appRows[0];
    const candidateId = application.candidate_id;

    const [profileRows] = await db.query('SELECT * FROM healthcare_profiles WHERE candidate_id = ?', [candidateId]);
    const [educationRows] = await db.query('SELECT * FROM education_records WHERE candidate_id = ?', [candidateId]);
    const [experienceRows] = await db.query('SELECT * FROM work_experience WHERE candidate_id = ?', [candidateId]);
    const [documentsRows] = await db.query('SELECT * FROM candidate_documents WHERE candidate_id = ?', [candidateId]);

    res.json({
      success: true,
      application,
      profile: profileRows[0] || {},
      education: educationRows,
      experience: experienceRows,
      documents: documentsRows[0] || {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/applications/:id', requireAuth, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    await db.query(
      'UPDATE applications SET status = ?, remarks = ? WHERE id = ?',
      [status, remarks, req.params.id]
    );
    
    res.json({ success: true, message: 'Application updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
