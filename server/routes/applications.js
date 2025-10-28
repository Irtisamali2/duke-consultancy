import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import emailService from '../services/emailService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const now = new Date();
    
    await db.query(
      'UPDATE applications SET status = ?, remarks = ?, modified_at = ?, modified_by = ?, modified_by_type = ? WHERE id = ?',
      [status, remarks, now, req.admin.id, 'admin', req.params.id]
    );
    
    res.json({ success: true, message: 'Application updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/applications/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const [appData] = await db.query(`
      SELECT a.*, c.email, hp.first_name, hp.last_name, hp.trade_applied_for
      FROM applications a
      LEFT JOIN candidates c ON a.candidate_id = c.id
      LEFT JOIN healthcare_profiles hp ON c.id = hp.candidate_id
      WHERE a.id = ?
    `, [req.params.id]);

    if (appData.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const now = new Date();
    await db.query(
      'UPDATE applications SET status = ?, modified_at = ?, modified_by = ?, modified_by_type = ? WHERE id = ?',
      [status, now, req.admin.id, 'admin', req.params.id]
    );

    const app = appData[0];
    if (app.email && (status === 'verified' || status === 'approved' || status === 'rejected')) {
      emailService.sendStatusChangeEmail(app.email, status, {
        candidate_name: `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Valued Candidate',
        application_id: String(app.id).padStart(4, '0'),
        updated_date: new Date().toLocaleDateString(),
        remarks: app.remarks || ''
      }).catch(err => console.error('Email send failed:', err));
    }
    
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/applications/:id', requireAuth, async (req, res) => {
  try {
    // Get the candidate_id before deleting the application
    const [appRows] = await db.query('SELECT candidate_id FROM applications WHERE id = ?', [req.params.id]);
    
    if (appRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    const candidateId = appRows[0].candidate_id;
    
    // Delete the application
    await db.query('DELETE FROM applications WHERE id = ?', [req.params.id]);
    
    // Check if candidate has any other applications
    const [remainingApps] = await db.query('SELECT COUNT(*) as count FROM applications WHERE candidate_id = ?', [candidateId]);
    
    // If candidate has no other applications, delete their documents and associated files
    if (remainingApps[0].count === 0) {
      const [docs] = await db.query('SELECT * FROM candidate_documents WHERE candidate_id = ?', [candidateId]);
      
      if (docs.length > 0) {
        const doc = docs[0];
        const fileFields = [
          'cv_resume_url',
          'passport_url',
          'degree_certificates_url',
          'license_certificate_url',
          'ielts_oet_certificate_url',
          'experience_letters_url'
        ];
        
        // Delete each file from disk
        for (const field of fileFields) {
          const fileUrl = doc[field];
          if (fileUrl && fileUrl.startsWith('/uploads/')) {
            // Strip leading slash to make it a relative path
            const relativePath = fileUrl.substring(1);
            const filePath = path.join(__dirname, '..', relativePath);
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath);
                console.log(`Deleted file: ${filePath}`);
              } catch (fileError) {
                console.error(`Failed to delete file ${filePath}:`, fileError);
              }
            } else {
              console.log(`File not found for deletion: ${filePath}`);
            }
          }
        }
        
        // Delete document records from database
        await db.query('DELETE FROM candidate_documents WHERE candidate_id = ?', [candidateId]);
      }
    }
    
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
