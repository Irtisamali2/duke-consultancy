import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import emailService from '../services/emailService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Configuration: Maximum applications allowed per candidate (can be changed to 2-3 later)
const MAX_APPLICATIONS_PER_CANDIDATE = 1;

const requireCandidateAuth = (req, res, next) => {
  try {
    const token = req.cookies.candidate_token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.candidateId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

router.get('/candidate/profile', requireCandidateAuth, async (req, res) => {
  try {
    const [profiles] = await db.query('SELECT * FROM healthcare_profiles WHERE candidate_id = ?', [req.candidateId]);
    const [education] = await db.query('SELECT * FROM education_records WHERE candidate_id = ?', [req.candidateId]);
    const [experience] = await db.query('SELECT * FROM work_experience WHERE candidate_id = ?', [req.candidateId]);
    const [documents] = await db.query('SELECT * FROM candidate_documents WHERE candidate_id = ?', [req.candidateId]);

    res.json({
      success: true,
      profile: profiles[0] || {},
      education,
      experience,
      documents: documents[0] || {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/candidate/profile/account', requireCandidateAuth, async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Check if email is already used by another candidate
    const [existingEmail] = await db.query(
      'SELECT id FROM candidates WHERE email = ? AND id != ?',
      [email, req.candidateId]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({ success: false, message: 'Email is already in use by another account' });
    }

    // Update candidate account information
    await db.query(
      'UPDATE candidates SET firstName = ?, lastName = ?, email = ?, phone = ? WHERE id = ?',
      [firstName, lastName, email, phone, req.candidateId]
    );

    res.json({ success: true, message: 'Account information updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/candidate/profile/password', requireCandidateAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    // Get current password hash from database
    const [candidates] = await db.query('SELECT password FROM candidates WHERE id = ?', [req.candidateId]);

    if (candidates.length === 0) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, candidates[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query('UPDATE candidates SET password = ? WHERE id = ?', [hashedPassword, req.candidateId]);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/candidate/profile/trade', requireCandidateAuth, async (req, res) => {
  try {
    const { trade_applied_for, availability_to_join, willingness_to_relocate, countries_preference, trades_preference } = req.body;

    const countriesJson = countries_preference ? JSON.stringify(countries_preference) : null;
    const tradesJson = trades_preference ? JSON.stringify(trades_preference) : null;
    
    await db.query(
      `UPDATE healthcare_profiles SET 
        trade_applied_for = ?, 
        availability_to_join = ?, 
        willingness_to_relocate = ?,
        countries_preference = ?,
        trades_preference = ?
      WHERE candidate_id = ?`,
      [
        trade_applied_for, 
        availability_to_join, 
        willingness_to_relocate,
        countriesJson,
        tradesJson,
        req.candidateId
      ]
    );

    res.json({ success: true, message: 'Trade information updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/candidate/profile/personal', requireCandidateAuth, async (req, res) => {
  try {
    const {
      first_name, last_name, father_husband_name, marital_status, gender, religion,
      date_of_birth, place_of_birth, province, country, cnic,
      passport_number, email_address,
      tel_off_no, tel_res_no, mobile_no, present_address, present_street, present_postal_code,
      permanent_address, permanent_street, permanent_postal_code
    } = req.body;

    await db.query(
      `UPDATE healthcare_profiles SET 
       first_name = ?, last_name = ?, father_husband_name = ?, marital_status = ?, gender = ?, religion = ?,
       date_of_birth = ?, place_of_birth = ?, province = ?, country = ?, cnic = ?,
       passport_number = ?, email_address = ?,
       tel_off_no = ?, tel_res_no = ?, mobile_no = ?, present_address = ?, present_street = ?, present_postal_code = ?,
       permanent_address = ?, permanent_street = ?, permanent_postal_code = ?
       WHERE candidate_id = ?`,
      [
        first_name, last_name, father_husband_name, marital_status, gender, religion,
        date_of_birth, place_of_birth, province, country, cnic,
        passport_number, email_address,
        tel_off_no, tel_res_no, mobile_no, present_address, present_street, present_postal_code,
        permanent_address, permanent_street, permanent_postal_code, req.candidateId
      ]
    );

    res.json({ success: true, message: 'Personal information updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/candidate/profile/experience', requireCandidateAuth, async (req, res) => {
  try {
    const { job_title, employer_hospital, specialization, from_date, to_date, total_experience } = req.body;

    await db.query(
      'INSERT INTO work_experience (candidate_id, job_title, employer_hospital, specialization, from_date, to_date, total_experience) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.candidateId, job_title, employer_hospital, specialization, from_date, to_date, total_experience]
    );

    res.json({ success: true, message: 'Experience added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/candidate/profile/experience/:id', requireCandidateAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM work_experience WHERE id = ? AND candidate_id = ?', [req.params.id, req.candidateId]);
    res.json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/candidate/profile/education', requireCandidateAuth, async (req, res) => {
  try {
    const { degree_diploma_title, university_institute_name, graduation_year, program_duration, registration_number, marks_percentage } = req.body;

    await db.query(
      'INSERT INTO education_records (candidate_id, degree_diploma_title, university_institute_name, graduation_year, program_duration, registration_number, marks_percentage) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.candidateId, degree_diploma_title, university_institute_name, graduation_year, program_duration, registration_number, marks_percentage]
    );

    res.json({ success: true, message: 'Education added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/candidate/profile/education/:id', requireCandidateAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM education_records WHERE id = ? AND candidate_id = ?', [req.params.id, req.candidateId]);
    res.json({ success: true, message: 'Education deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/candidate/profile/documents', requireCandidateAuth, async (req, res) => {
  try {
    const { cv_resume_url, passport_url, degree_certificates_url, license_certificate_url, ielts_oet_certificate_url, experience_letters_url } = req.body;

    const [existing] = await db.query('SELECT id FROM candidate_documents WHERE candidate_id = ?', [req.candidateId]);

    if (existing.length > 0) {
      await db.query(
        `UPDATE candidate_documents SET 
         cv_resume_url = ?, passport_url = ?, degree_certificates_url = ?, 
         license_certificate_url = ?, ielts_oet_certificate_url = ?, experience_letters_url = ?
         WHERE candidate_id = ?`,
        [cv_resume_url, passport_url, degree_certificates_url, license_certificate_url, ielts_oet_certificate_url, experience_letters_url, req.candidateId]
      );
    } else {
      await db.query(
        'INSERT INTO candidate_documents (candidate_id, cv_resume_url, passport_url, degree_certificates_url, license_certificate_url, ielts_oet_certificate_url, experience_letters_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [req.candidateId, cv_resume_url, passport_url, degree_certificates_url, license_certificate_url, ielts_oet_certificate_url, experience_letters_url]
      );
    }

    res.json({ success: true, message: 'Documents updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/candidate/submit-application', requireCandidateAuth, async (req, res) => {
  try {
    const { job_id } = req.body;

    // Check how many applications this candidate has already submitted
    const [existingApplications] = await db.query(
      'SELECT COUNT(*) as count FROM applications WHERE candidate_id = ?',
      [req.candidateId]
    );

    const applicationCount = existingApplications[0].count;

    // Enforce application limit
    if (applicationCount >= MAX_APPLICATIONS_PER_CANDIDATE) {
      return res.status(400).json({ 
        success: false, 
        message: `You have already submitted ${applicationCount} application${applicationCount > 1 ? 's' : ''}. Only ${MAX_APPLICATIONS_PER_CANDIDATE} application${MAX_APPLICATIONS_PER_CANDIDATE > 1 ? 's are' : ' is'} allowed per candidate.`
      });
    }

    const now = new Date();
    const [result] = await db.query(
      'INSERT INTO applications (candidate_id, job_id, applied_date, status, submitted_at, modified_at, modified_by, modified_by_type) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)',
      [req.candidateId, job_id || null, 'pending', now, now, req.candidateId, 'candidate']
    );

    const [candidate] = await db.query('SELECT email FROM candidates WHERE id = ?', [req.candidateId]);
    const [profile] = await db.query('SELECT first_name, last_name, trade_applied_for FROM healthcare_profiles WHERE candidate_id = ?', [req.candidateId]);
    
    let jobTitle = 'General Application';
    if (job_id) {
      const [job] = await db.query('SELECT title FROM jobs WHERE id = ?', [job_id]);
      if (job.length > 0) {
        jobTitle = job[0].title;
      }
    }

    if (candidate.length > 0 && profile.length > 0) {
      const candidateData = candidate[0];
      const profileData = profile[0];
      
      emailService.sendApplicationReceivedEmail(candidateData.email, {
        candidate_name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Valued Candidate',
        application_id: String(result.insertId).padStart(4, '0'),
        job_title: jobTitle,
        trade: profileData.trade_applied_for || 'Healthcare Professional',
        submitted_date: new Date().toLocaleDateString()
      }).catch(err => console.error('Email send failed:', err));
    }

    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/candidate/applications', requireCandidateAuth, async (req, res) => {
  try {
    const [applications] = await db.query(`
      SELECT a.*, j.title as job_title, j.location, j.country
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE a.candidate_id = ?
      ORDER BY a.applied_date DESC
    `, [req.candidateId]);

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
