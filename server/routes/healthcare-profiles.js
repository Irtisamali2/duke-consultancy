import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/healthcare-profiles', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id as candidate_id,
        c.email,
        c.status,
        c.created_at,
        hp.first_name,
        hp.last_name,
        hp.mobile_no,
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

// Update healthcare profile (admin only)
router.put('/healthcare-profiles/:id', requireAuth, async (req, res) => {
  try {
    const candidateId = req.params.id;
    const { email, status, first_name, last_name, mobile_no, newPassword } = req.body;

    // Update candidates table
    if (email || status || newPassword) {
      const updates = [];
      const values = [];

      if (email) {
        updates.push('email = ?');
        values.push(email);
      }
      if (status) {
        updates.push('status = ?');
        values.push(status);
      }
      if (newPassword) {
        // Validate password length
        if (newPassword.length < 6) {
          return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updates.push('password = ?');
        values.push(hashedPassword);
      }

      if (updates.length > 0) {
        values.push(candidateId);
        await db.query(
          `UPDATE candidates SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
      }
    }

    // Update healthcare_profiles table
    if (first_name || last_name || mobile_no) {
      const updates = [];
      const values = [];

      if (first_name) {
        updates.push('first_name = ?');
        values.push(first_name);
      }
      if (last_name) {
        updates.push('last_name = ?');
        values.push(last_name);
      }
      if (mobile_no !== undefined) {
        updates.push('mobile_no = ?');
        values.push(mobile_no);
      }

      if (updates.length > 0) {
        values.push(candidateId);
        await db.query(
          `UPDATE healthcare_profiles SET ${updates.join(', ')} WHERE candidate_id = ?`,
          values
        );
      }
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete healthcare profile and all associated data (admin only)
router.delete('/healthcare-profiles/:id', requireAuth, async (req, res) => {
  try {
    const candidateId = req.params.id;

    // Get ALL documents for this candidate (all applications)
    const [allDocs] = await db.query('SELECT * FROM candidate_documents WHERE candidate_id = ?', [candidateId]);

    // Delete all document files for all applications
    for (const doc of allDocs) {
      const fileFields = [
        'cv_resume_url',
        'passport_url',
        'degree_certificates_url',
        'license_certificate_url',
        'ielts_oet_certificate_url',
        'experience_letters_url'
      ];

      // Delete standard document files
      for (const field of fileFields) {
        const fileUrl = doc[field];
        if (fileUrl && fileUrl.startsWith('/uploads/')) {
          const relativePath = fileUrl.substring(1);
          const filePath = path.join(__dirname, '..', relativePath);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
              console.log(`Deleted file: ${filePath}`);
            } catch (fileError) {
              console.error(`Failed to delete file ${filePath}:`, fileError);
            }
          }
        }
      }
      
      // Delete additional_files
      if (doc.additional_files) {
        try {
          const additionalFiles = typeof doc.additional_files === 'string' 
            ? JSON.parse(doc.additional_files) 
            : doc.additional_files;
          
          if (Array.isArray(additionalFiles)) {
            for (const file of additionalFiles) {
              const fileUrl = file.url || file;
              if (fileUrl && fileUrl.startsWith('/uploads/')) {
                const relativePath = fileUrl.substring(1);
                const filePath = path.join(__dirname, '..', relativePath);
                if (fs.existsSync(filePath)) {
                  try {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted additional file: ${filePath}`);
                  } catch (fileError) {
                    console.error(`Failed to delete additional file:`, fileError);
                  }
                }
              }
            }
          }
        } catch (parseError) {
          console.error('Error parsing additional_files:', parseError);
        }
      }
    }
    
    // Delete all profile images for all applications
    const [allProfiles] = await db.query('SELECT profile_image_url FROM healthcare_profiles WHERE candidate_id = ?', [candidateId]);
    
    for (const profile of allProfiles) {
      if (profile.profile_image_url && profile.profile_image_url.startsWith('/uploads/')) {
        const relativePath = profile.profile_image_url.substring(1);
        const filePath = path.join(__dirname, '..', relativePath);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted profile image: ${filePath}`);
          } catch (fileError) {
            console.error(`Failed to delete profile image:`, fileError);
          }
        }
      }
    }

    // CASCADE DELETE: Delete all data for this candidate
    // Order matters: delete child records first, then parent
    await db.query('DELETE FROM candidate_documents WHERE candidate_id = ?', [candidateId]);
    await db.query('DELETE FROM work_experience WHERE candidate_id = ?', [candidateId]);
    await db.query('DELETE FROM education_records WHERE candidate_id = ?', [candidateId]);
    await db.query('DELETE FROM healthcare_profiles WHERE candidate_id = ?', [candidateId]);
    await db.query('DELETE FROM applications WHERE candidate_id = ?', [candidateId]);
    await db.query('DELETE FROM candidates WHERE id = ?', [candidateId]);

    console.log(`Successfully deleted candidate ${candidateId} and ALL related data (all applications, documents, files)`);

    res.json({ success: true, message: 'Candidate profile and ALL related data deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
