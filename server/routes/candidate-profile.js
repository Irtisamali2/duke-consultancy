import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pool from '../db.js';
import emailService from '../services/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const profileUpload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit for profile images
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png)'));
    }
  }
});

// Configure multer for document uploads
const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'document-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const documentUpload = multer({
  storage: documentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for documents
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed (jpeg, jpg, png, pdf)'));
    }
  }
});

// Note: One application per job per candidate (enforced by unique constraint)

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
    const applicationId = req.query.application_id ? parseInt(req.query.application_id) : null;
    
    const { rows: profiles } = await pool.query(
      'SELECT * FROM healthcare_profiles WHERE candidate_id = $1 AND (application_id = $2 OR (application_id IS NULL AND $3 IS NULL))',
      [req.candidateId, applicationId, applicationId]
    );
    const { rows: education } = await pool.query(
      'SELECT * FROM education_records WHERE candidate_id = $1 AND (application_id = $2 OR (application_id IS NULL AND $3 IS NULL))',
      [req.candidateId, applicationId, applicationId]
    );
    const { rows: experience } = await pool.query(
      'SELECT * FROM work_experience WHERE candidate_id = $1 AND (application_id = $2 OR (application_id IS NULL AND $3 IS NULL))',
      [req.candidateId, applicationId, applicationId]
    );
    const { rows: documents } = await pool.query(
      'SELECT * FROM candidate_documents WHERE candidate_id = $1 AND (application_id = $2 OR (application_id IS NULL AND $3 IS NULL))',
      [req.candidateId, applicationId, applicationId]
    );

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

// Get basic profile info only (for new applications - only name, email, profile image)
router.get('/candidate/profile/basic', requireCandidateAuth, async (req, res) => {
  try {
    // Get candidate email from candidates table
    const { rows: candidates } = await pool.query(
      'SELECT email FROM candidates WHERE id = $1',
      [req.candidateId]
    );
    
    // Get "My Profile" data only (not application-specific profiles)
    // This ensures sidebar always shows the general profile image, not job application images
    const { rows: profiles } = await pool.query(
      'SELECT first_name, last_name, profile_image_url FROM healthcare_profiles WHERE candidate_id = $1 AND application_id IS NULL ORDER BY id DESC LIMIT 1',
      [req.candidateId]
    );
    
    const candidate = candidates[0] || {};
    const profile = profiles[0] || {};
    
    res.json({
      success: true,
      profile: {
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email_address: candidate.email || '',
        profile_image_url: profile.profile_image_url || null
      }
    });
  } catch (error) {
    console.error('Error in /candidate/profile/basic:', error);
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
    const { rows: existingEmail } = await pool.query(
      'SELECT id FROM candidates WHERE email = $1 AND id != $2',
      [email, req.candidateId]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({ success: false, message: 'Email is already in use by another account' });
    }

    // Update email in candidates table
    await pool.query(
      'UPDATE candidates SET email = $1 WHERE id = $2',
      [email, req.candidateId]
    );
    
    // Update first_name, last_name, mobile_no in most recent healthcare_profiles
    await pool.query(
      'UPDATE healthcare_profiles SET first_name = $1, last_name = $2, mobile_no = $3 WHERE id IN (SELECT id FROM healthcare_profiles WHERE candidate_id = $4 ORDER BY id DESC LIMIT 1)',
      [firstName, lastName, phone, req.candidateId]
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
    const { rows: candidates } = await pool.query('SELECT password FROM candidates WHERE id = $1', [req.candidateId]);

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
    await pool.query('UPDATE candidates SET password = $1 WHERE id = $2', [hashedPassword, req.candidateId]);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/candidate/profile/trade', requireCandidateAuth, async (req, res) => {
  try {
    const { trade_applied_for, availability_to_join, willingness_to_relocate, countries_preference, trades_preference, application_id } = req.body;

    const countriesJson = countries_preference ? JSON.stringify(countries_preference) : null;
    const tradesJson = trades_preference ? JSON.stringify(trades_preference) : null;
    const appId = application_id ? parseInt(application_id) : null;
    
    // Check if profile exists for this application
    const { rows: existing } = await pool.query(
      'SELECT id FROM healthcare_profiles WHERE candidate_id = $1 AND (application_id = $2 OR (application_id IS NULL AND $3 IS NULL))',
      [req.candidateId, appId, appId]
    );
    
    if (existing.length > 0) {
      // Update existing profile
      await pool.query(
        `UPDATE healthcare_profiles SET 
          trade_applied_for = $1, 
          availability_to_join = $2, 
          willingness_to_relocate = $3,
          countries_preference = $4,
          trades_preference = $5
        WHERE candidate_id = $6 AND (application_id = $7 OR (application_id IS NULL AND $8 IS NULL))`,
        [
          trade_applied_for, 
          availability_to_join, 
          willingness_to_relocate,
          countriesJson,
          tradesJson,
          req.candidateId,
          appId,
          appId
        ]
      );
    } else {
      // Create new profile for this application
      await pool.query(
        `INSERT INTO healthcare_profiles (candidate_id, application_id, trade_applied_for, availability_to_join, willingness_to_relocate, countries_preference, trades_preference)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [req.candidateId, appId, trade_applied_for, availability_to_join, willingness_to_relocate, countriesJson, tradesJson]
      );
    }

    res.json({ success: true, message: 'Trade information updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/candidate/profile/personal', requireCandidateAuth, async (req, res) => {
  try {
    const {
      first_name, middle_name, last_name, father_husband_name, marital_status, gender, religion,
      date_of_birth, place_of_birth, province, country, cnic, cnic_issue_date, cnic_expire_date,
      passport_number, passport_issue_date, passport_expire_date, email_address, confirm_email_address,
      tel_off_no, tel_res_no, mobile_no, present_address, present_street, present_postal_code,
      permanent_address, permanent_street, permanent_postal_code, application_id
    } = req.body;

    const appId = application_id ? parseInt(application_id) : null;
    
    // Convert empty strings to NULL for date fields to prevent MySQL errors
    const safeDateOfBirth = date_of_birth || null;
    const safeCnicIssueDate = cnic_issue_date || null;
    const safeCnicExpireDate = cnic_expire_date || null;
    const safePassportIssueDate = passport_issue_date || null;
    const safePassportExpireDate = passport_expire_date || null;
    
    // Check if profile exists for this application
    const { rows: existing } = await pool.query(
      'SELECT id FROM healthcare_profiles WHERE candidate_id = $1 AND (application_id = $2 OR (application_id IS NULL AND $3 IS NULL))',
      [req.candidateId, appId, appId]
    );
    
    if (existing.length > 0) {
      // Update existing profile
      await pool.query(
        `UPDATE healthcare_profiles SET 
         first_name = $1, middle_name = $2, last_name = $3, father_husband_name = $4, marital_status = $5, gender = $6, religion = $7,
         date_of_birth = $8, place_of_birth = $9, province = $10, country = $11, cnic = $12, cnic_issue_date = $13, cnic_expire_date = $14,
         passport_number = $15, passport_issue_date = $16, passport_expire_date = $17, email_address = $18, confirm_email_address = $19,
         tel_off_no = $20, tel_res_no = $21, mobile_no = $22, present_address = $23, present_street = $24, present_postal_code = $25,
         permanent_address = $26, permanent_street = $27, permanent_postal_code = $28
         WHERE candidate_id = $29 AND (application_id = $30 OR (application_id IS NULL AND $31 IS NULL))`,
        [
          first_name, middle_name, last_name, father_husband_name, marital_status, gender, religion,
          safeDateOfBirth, place_of_birth, province, country, cnic, safeCnicIssueDate, safeCnicExpireDate,
          passport_number, safePassportIssueDate, safePassportExpireDate, email_address, confirm_email_address,
          tel_off_no, tel_res_no, mobile_no, present_address, present_street, present_postal_code,
          permanent_address, permanent_street, permanent_postal_code, req.candidateId, appId, appId
        ]
      );
    } else {
      // Create new profile for this application
      await pool.query(
        `INSERT INTO healthcare_profiles (candidate_id, application_id, first_name, middle_name, last_name, father_husband_name, 
         marital_status, gender, religion, date_of_birth, place_of_birth, province, country, cnic, cnic_issue_date, cnic_expire_date,
         passport_number, passport_issue_date, passport_expire_date, email_address, confirm_email_address, tel_off_no, tel_res_no, 
         mobile_no, present_address, present_street, present_postal_code, permanent_address, permanent_street, permanent_postal_code)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)`,
        [
          req.candidateId, appId, first_name, middle_name, last_name, father_husband_name,
          marital_status, gender, religion, safeDateOfBirth, place_of_birth, province, country, cnic, safeCnicIssueDate, safeCnicExpireDate,
          passport_number, safePassportIssueDate, safePassportExpireDate, email_address, confirm_email_address, tel_off_no, tel_res_no,
          mobile_no, present_address, present_street, present_postal_code, permanent_address, permanent_street, permanent_postal_code
        ]
      );
    }

    res.json({ success: true, message: 'Personal information updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/candidate/profile/experience', requireCandidateAuth, async (req, res) => {
  try {
    const { job_title, employer_hospital, specialization, from_date, to_date, total_experience, application_id } = req.body;
    const appId = application_id ? parseInt(application_id) : null;
    
    // Convert empty strings to NULL for date fields
    const safeFromDate = from_date || null;
    const safeToDate = to_date || null;

    const { rows } = await pool.query(
      'INSERT INTO work_experience (candidate_id, application_id, job_title, employer_hospital, specialization, from_date, to_date, total_experience) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [req.candidateId, appId, job_title, employer_hospital, specialization, safeFromDate, safeToDate, total_experience]
    );

    // Return the newly created experience with its ID
    const newExperience = rows[0];

    res.json({ success: true, message: 'Experience added', experience: newExperience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/candidate/profile/experience/:id', requireCandidateAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM work_experience WHERE id = $1 AND candidate_id = $2', [req.params.id, req.candidateId]);
    res.json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/candidate/profile/experience/:id', requireCandidateAuth, async (req, res) => {
  try {
    const { job_title, employer_hospital, specialization, from_date, to_date, total_experience } = req.body;
    
    // Convert empty strings to NULL for date fields
    const safeFromDate = from_date || null;
    const safeToDate = to_date || null;
    
    await pool.query(
      `UPDATE work_experience SET 
       job_title = $1, employer_hospital = $2, specialization = $3, from_date = $4, to_date = $5, total_experience = $6
       WHERE id = $7 AND candidate_id = $8`,
      [job_title, employer_hospital, specialization, safeFromDate, safeToDate, total_experience, req.params.id, req.candidateId]
    );
    
    res.json({ success: true, message: 'Experience updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/candidate/profile/education', requireCandidateAuth, async (req, res) => {
  try {
    const { degree_diploma_title, university_institute_name, graduation_year, program_duration, registration_number, marks_percentage, application_id } = req.body;
    const appId = application_id ? parseInt(application_id) : null;
    
    // Convert empty strings to NULL for date fields
    const safeGraduationYear = graduation_year || null;

    await pool.query(
      'INSERT INTO education_records (candidate_id, application_id, degree_diploma_title, university_institute_name, graduation_year, program_duration, registration_number, marks_percentage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [req.candidateId, appId, degree_diploma_title, university_institute_name, safeGraduationYear, program_duration, registration_number, marks_percentage]
    );

    res.json({ success: true, message: 'Education added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/candidate/profile/education/:id', requireCandidateAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM education_records WHERE id = $1 AND candidate_id = $2', [req.params.id, req.candidateId]);
    res.json({ success: true, message: 'Education deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/candidate/profile/education/:id', requireCandidateAuth, async (req, res) => {
  try {
    const { degree_diploma_title, university_institute_name, graduation_year, program_duration, registration_number, marks_percentage } = req.body;
    
    // Convert empty strings to NULL for date fields
    const safeGraduationYear = graduation_year || null;
    
    await pool.query(
      `UPDATE education_records SET 
       degree_diploma_title = $1, university_institute_name = $2, graduation_year = $3, program_duration = $4, registration_number = $5, marks_percentage = $6
       WHERE id = $7 AND candidate_id = $8`,
      [degree_diploma_title, university_institute_name, safeGraduationYear, program_duration, registration_number, marks_percentage, req.params.id, req.candidateId]
    );
    
    res.json({ success: true, message: 'Education updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/candidate/profile/documents', requireCandidateAuth, async (req, res) => {
  try {
    const { cv_resume_url, passport_url, degree_certificates_url, license_certificate_url, ielts_oet_certificate_url, experience_letters_url } = req.body;

    const { rows: existing } = await pool.query('SELECT id FROM candidate_documents WHERE candidate_id = $1', [req.candidateId]);

    if (existing.length > 0) {
      await pool.query(
        `UPDATE candidate_documents SET 
         cv_resume_url = $1, passport_url = $2, degree_certificates_url = $3, 
         license_certificate_url = $4, ielts_oet_certificate_url = $5, experience_letters_url = $6
         WHERE candidate_id = $7`,
        [cv_resume_url, passport_url, degree_certificates_url, license_certificate_url, ielts_oet_certificate_url, experience_letters_url, req.candidateId]
      );
    } else {
      await pool.query(
        'INSERT INTO candidate_documents (candidate_id, cv_resume_url, passport_url, degree_certificates_url, license_certificate_url, ielts_oet_certificate_url, experience_letters_url) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [req.candidateId, cv_resume_url, passport_url, degree_certificates_url, license_certificate_url, ielts_oet_certificate_url, experience_letters_url]
      );
    }

    res.json({ success: true, message: 'Documents updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/candidate/profile/image', requireCandidateAuth, profileUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const application_id = req.body.application_id ? parseInt(req.body.application_id) : null;

    // Get existing profile image for this specific application
    const { rows: profiles } = await pool.query(
      'SELECT profile_image_url FROM healthcare_profiles WHERE candidate_id = $1 AND (application_id = $2 OR (application_id IS NULL AND $3 IS NULL))',
      [req.candidateId, application_id, application_id]
    );
    const oldImageUrl = profiles[0]?.profile_image_url;

    // Delete old profile image if exists
    if (oldImageUrl) {
      const oldImagePath = path.join(__dirname, '..', oldImageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Check if profile exists for this application
    if (profiles.length > 0) {
      // Update existing profile
      await pool.query(
        'UPDATE healthcare_profiles SET profile_image_url = $1 WHERE candidate_id = $2 AND (application_id = $3 OR (application_id IS NULL AND $4 IS NULL))',
        [imageUrl, req.candidateId, application_id, application_id]
      );
    } else {
      // Create new profile for this application with just the image
      await pool.query(
        'INSERT INTO healthcare_profiles (candidate_id, application_id, profile_image_url) VALUES ($1, $2, $3)',
        [req.candidateId, application_id, imageUrl]
      );
    }

    res.json({ success: true, message: 'Profile image uploaded successfully', imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/candidate/profile/image', requireCandidateAuth, async (req, res) => {
  try {
    // Get existing profile image
    const { rows: profiles } = await pool.query('SELECT profile_image_url FROM healthcare_profiles WHERE candidate_id = $1', [req.candidateId]);
    const imageUrl = profiles[0]?.profile_image_url;

    if (!imageUrl) {
      return res.status(404).json({ success: false, message: 'No profile image found' });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '..', imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Remove from database
    await pool.query('UPDATE healthcare_profiles SET profile_image_url = NULL WHERE candidate_id = $1', [req.candidateId]);

    res.json({ success: true, message: 'Profile image removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Document upload endpoint for application documents
router.post('/candidate/upload-document', requireCandidateAuth, documentUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, message: 'Document uploaded successfully', url: fileUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/candidate/submit-application', requireCandidateAuth, async (req, res) => {
  try {
    const { job_id } = req.body;

    if (!job_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Job ID is required'
      });
    }

    // Check if there's a draft application for this job
    const { rows: draftApp } = await pool.query(
      'SELECT id FROM applications WHERE candidate_id = $1 AND job_id = $2 AND status = $3',
      [req.candidateId, job_id, 'draft']
    );

    // Check if candidate has an active non-draft application for this job
    const { rows: existingApp } = await pool.query(
      'SELECT id FROM applications WHERE candidate_id = $1 AND job_id = $2 AND status != $3',
      [req.candidateId, job_id, 'draft']
    );

    if (existingApp.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already submitted an application. You can view/edit it from your profile.'
      });
    }

    const now = new Date();
    let applicationId;

    if (draftApp.length > 0) {
      // Update existing draft to pending status
      applicationId = draftApp[0].id;
      await pool.query(
        'UPDATE applications SET status = $1, submitted_at = $2, modified_at = $3, modified_by = $4, modified_by_type = $5 WHERE id = $6',
        ['pending', now, now, req.candidateId, 'candidate', applicationId]
      );
    } else {
      // Create new application (shouldn't happen in current flow, but keep for safety)
      const { rows: result } = await pool.query(
        'INSERT INTO applications (candidate_id, job_id, applied_date, status, submitted_at, modified_at, modified_by, modified_by_type) VALUES ($1, $2, NOW(), $3, $4, $5, $6, $7) RETURNING id',
        [req.candidateId, job_id || null, 'pending', now, now, req.candidateId, 'candidate']
      );
      applicationId = result[0].id;
    }

    const { rows: candidate } = await pool.query('SELECT email FROM candidates WHERE id = $1', [req.candidateId]);
    const { rows: profile } = await pool.query('SELECT first_name, last_name, trade_applied_for FROM healthcare_profiles WHERE candidate_id = $1', [req.candidateId]);
    
    let jobTitle = 'General Application';
    if (job_id) {
      const { rows: job } = await pool.query('SELECT title FROM jobs WHERE id = $1', [job_id]);
      if (job.length > 0) {
        jobTitle = job[0].title;
      }
    }

    if (candidate.length > 0 && profile.length > 0) {
      const candidateData = candidate[0];
      const profileData = profile[0];
      
      emailService.sendApplicationReceivedEmail(candidateData.email, {
        candidate_name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Valued Candidate',
        application_id: String(applicationId).padStart(4, '0'),
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
    const { rows: applications } = await pool.query(`
      SELECT a.*, j.title as job_title, j.location, j.country
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE a.candidate_id = $1
      ORDER BY a.applied_date DESC
    `, [req.candidateId]);

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/candidate/application/:id', requireCandidateAuth, async (req, res) => {
  try {
    const { rows: application } = await pool.query(
      'SELECT status FROM applications WHERE id = $1 AND candidate_id = $2',
      [req.params.id, req.candidateId]
    );

    if (application.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application[0].status !== 'draft') {
      return res.status(403).json({ success: false, message: 'Only draft applications can be deleted' });
    }

    await pool.query('DELETE FROM applications WHERE id = $1 AND candidate_id = $2', [req.params.id, req.candidateId]);
    res.json({ success: true, message: 'Draft application deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/candidate/save-draft-application', requireCandidateAuth, async (req, res) => {
  try {
    const { job_id } = req.body;
    
    // Check if draft already exists for this job
    const { rows: existing } = await pool.query(
      'SELECT id FROM applications WHERE candidate_id = $1 AND job_id = $2 AND status = $3',
      [req.candidateId, job_id, 'draft']
    );
    
    if (existing.length > 0) {
      // Update existing draft
      await pool.query(
        'UPDATE applications SET applied_date = NOW() WHERE id = $1',
        [existing[0].id]
      );
      res.json({ success: true, message: 'Draft updated', applicationId: existing[0].id });
    } else {
      // Create new draft
      const { rows: result } = await pool.query(
        'INSERT INTO applications (candidate_id, job_id, status, applied_date) VALUES ($1, $2, $3, NOW()) RETURNING id',
        [req.candidateId, job_id, 'draft']
      );
      res.json({ success: true, message: 'Draft created', applicationId: result[0].id });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
