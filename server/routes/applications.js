import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import emailService from '../services/emailService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/applications', requireAuth, async (req, res) => {
  try {
    const { job_id, country, trade, from_date, to_date, status } = req.query;
    
    let query = `
      SELECT 
        a.*,
        c.email,
        hp.first_name,
        hp.last_name,
        hp.mobile_no,
        hp.country,
        hp.trade_applied_for,
        j.title as job_title
      FROM applications a
      LEFT JOIN candidates c ON a.candidate_id = c.id
      LEFT JOIN healthcare_profiles hp ON c.id = hp.candidate_id
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (job_id) {
      query += ' AND a.job_id = ?';
      params.push(job_id);
    }
    
    if (country) {
      query += ' AND hp.country = ?';
      params.push(country);
    }
    
    if (trade) {
      query += ' AND hp.trade_applied_for = ?';
      params.push(trade);
    }
    
    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }
    
    if (from_date) {
      query += ' AND DATE(a.applied_date) >= ?';
      params.push(from_date);
    }
    
    if (to_date) {
      query += ' AND DATE(a.applied_date) <= ?';
      params.push(to_date);
    }
    
    query += ' ORDER BY a.applied_date DESC';
    
    const [rows] = await db.query(query, params);
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
      SELECT a.*, c.email, hp.first_name, hp.last_name, hp.trade_applied_for, j.title as job_title
      FROM applications a
      LEFT JOIN candidates c ON a.candidate_id = c.id
      LEFT JOIN healthcare_profiles hp ON c.id = hp.candidate_id
      LEFT JOIN jobs j ON a.job_id = j.id
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
        job_title: app.job_title || 'General Application',
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

router.post('/applications/export', requireAuth, async (req, res) => {
  try {
    const { application_ids, job_id, country, trade, from_date, to_date, status } = req.body;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    let query = `
      SELECT 
        a.id as application_id,
        a.status as application_status,
        a.applied_date,
        a.remarks,
        c.email,
        hp.first_name,
        hp.last_name,
        hp.father_husband_name,
        hp.marital_status,
        hp.gender,
        hp.religion,
        hp.date_of_birth,
        hp.place_of_birth,
        hp.province,
        hp.country,
        hp.cnic,
        hp.passport_number,
        hp.mobile_no,
        hp.trade_applied_for,
        hp.availability_to_join,
        hp.willingness_to_relocate,
        hp.present_address,
        hp.permanent_address,
        j.title as job_title,
        j.location as job_location,
        j.country as job_country,
        cd.cv_resume_url,
        cd.passport_url,
        cd.degree_certificates_url,
        cd.license_certificate_url,
        cd.ielts_oet_certificate_url,
        cd.experience_letters_url
      FROM applications a
      LEFT JOIN candidates c ON a.candidate_id = c.id
      LEFT JOIN healthcare_profiles hp ON c.id = hp.candidate_id
      LEFT JOIN jobs j ON a.job_id = j.id
      LEFT JOIN candidate_documents cd ON c.id = cd.candidate_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (application_ids && application_ids.length > 0) {
      query += ` AND a.id IN (${application_ids.map(() => '?').join(',')})`;
      params.push(...application_ids);
    } else {
      if (job_id) {
        query += ' AND a.job_id = ?';
        params.push(job_id);
      }
      
      if (country) {
        query += ' AND hp.country = ?';
        params.push(country);
      }
      
      if (trade) {
        query += ' AND hp.trade_applied_for = ?';
        params.push(trade);
      }
      
      if (status) {
        query += ' AND a.status = ?';
        params.push(status);
      }
      
      if (from_date) {
        query += ' AND DATE(a.applied_date) >= ?';
        params.push(from_date);
      }
      
      if (to_date) {
        query += ' AND DATE(a.applied_date) <= ?';
        params.push(to_date);
      }
    }
    
    query += ' ORDER BY a.applied_date DESC';
    
    const [applications] = await db.query(query, params);
    
    if (applications.length === 0) {
      return res.status(404).json({ success: false, message: 'No applications found to export' });
    }
    
    const exportData = applications.map(app => ({
      'Application ID': String(app.application_id).padStart(6, '0'),
      'Applied Date': new Date(app.applied_date).toLocaleDateString(),
      'Status': app.application_status,
      'Job Title': app.job_title || 'General Application',
      'Job Location': app.job_location || '',
      'Job Country': app.job_country || '',
      'First Name': app.first_name || '',
      'Last Name': app.last_name || '',
      'Email': app.email || '',
      'Mobile': app.mobile_no || '',
      'Father/Husband Name': app.father_husband_name || '',
      'Marital Status': app.marital_status || '',
      'Gender': app.gender || '',
      'Religion': app.religion || '',
      'Date of Birth': app.date_of_birth ? new Date(app.date_of_birth).toLocaleDateString() : '',
      'Place of Birth': app.place_of_birth || '',
      'Province': app.province || '',
      'Country': app.country || '',
      'CNIC': app.cnic || '',
      'Passport Number': app.passport_number || '',
      'Trade Applied For': app.trade_applied_for || '',
      'Availability to Join': app.availability_to_join || '',
      'Willingness to Relocate': app.willingness_to_relocate || '',
      'Present Address': app.present_address || '',
      'Permanent Address': app.permanent_address || '',
      'Remarks': app.remarks || '',
      'CV/Resume': app.cv_resume_url ? `${baseUrl}${app.cv_resume_url}` : '',
      'Passport Document': app.passport_url ? `${baseUrl}${app.passport_url}` : '',
      'Degree Certificates': app.degree_certificates_url ? `${baseUrl}${app.degree_certificates_url}` : '',
      'License Certificate': app.license_certificate_url ? `${baseUrl}${app.license_certificate_url}` : '',
      'IELTS/OET Certificate': app.ielts_oet_certificate_url ? `${baseUrl}${app.ielts_oet_certificate_url}` : '',
      'Experience Letters': app.experience_letters_url ? `${baseUrl}${app.experience_letters_url}` : ''
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
    
    worksheet['!cols'] = [
      { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 25 }, { wch: 20 },
      { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 15 },
      { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
      { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 18 },
      { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 30 }, { wch: 30 },
      { wch: 50 }, { wch: 50 }, { wch: 50 }, { wch: 50 }, { wch: 50 }, { wch: 50 }
    ];
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Disposition', `attachment; filename=applications_${new Date().toISOString().split('T')[0]}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
