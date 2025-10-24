import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

router.put('/candidate/profile/trade', requireCandidateAuth, async (req, res) => {
  try {
    const { trade_applied_for, availability_to_join, willingness_to_relocate } = req.body;

    await db.query(
      'UPDATE healthcare_profiles SET trade_applied_for = ?, availability_to_join = ?, willingness_to_relocate = ? WHERE candidate_id = ?',
      [trade_applied_for, availability_to_join, willingness_to_relocate, req.candidateId]
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

    await db.query(
      'INSERT INTO applications (candidate_id, job_id, applied_date, status) VALUES (?, ?, NOW(), ?)',
      [req.candidateId, job_id || null, 'pending']
    );

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
