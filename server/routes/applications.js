import express from 'express';
import pool from '../db.js';
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
      LEFT JOIN healthcare_profiles hp ON a.id = hp.application_id
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (job_id) {
      query += ` AND a.job_id = ?`;
      params.push(job_id);
    }
    
    if (country) {
      query += ` AND hp.country = ?`;
      params.push(country);
    }
    
    if (trade) {
      query += ` AND hp.trade_applied_for = ?`;
      params.push(trade);
    }
    
    if (status) {
      query += ` AND a.status = ?`;
      params.push(status);
    }
    
    if (from_date) {
      query += ` AND DATE(a.applied_date) >= ?`;
      params.push(from_date);
    }
    
    if (to_date) {
      query += ` AND DATE(a.applied_date) <= ?`;
      params.push(to_date);
    }
    
    query += ' ORDER BY a.applied_date DESC';
    
    const [rows] = await pool.query(query, params);
    res.json({ success: true, applications: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/applications/:id', requireAuth, async (req, res) => {
  try {
    const [appRows] = await pool.query(`
      SELECT a.*, j.title as job_title, j.location, j.country
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE a.id = ?
    `, [req.params.id]);
    
    if (appRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const application = appRows[0];

    const [profileRows] = await pool.query('SELECT * FROM healthcare_profiles WHERE application_id = ?', [req.params.id]);
    const [educationRows] = await pool.query('SELECT * FROM education_records WHERE application_id = ?', [req.params.id]);
    const [experienceRows] = await pool.query('SELECT * FROM work_experience WHERE application_id = ?', [req.params.id]);
    const [documentsRows] = await pool.query('SELECT * FROM candidate_documents WHERE application_id = ?', [req.params.id]);

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
    
    await pool.query(
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
    
    const [appData] = await pool.query(`
      SELECT a.*, c.email, hp.first_name, hp.last_name, hp.trade_applied_for, j.title as job_title
      FROM applications a
      LEFT JOIN candidates c ON a.candidate_id = c.id
      LEFT JOIN healthcare_profiles hp ON a.id = hp.application_id
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE a.id = ?
    `, [req.params.id]);

    if (appData.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const now = new Date();
    await pool.query(
      'UPDATE applications SET status = ?, modified_at = ?, modified_by = ?, modified_by_type = ? WHERE id = ?',
      [status, now, req.admin.id, 'admin', req.params.id]
    );

    const app = appData[0];
    if (app.email && (status === 'pending' || status === 'verified' || status === 'approved' || status === 'rejected')) {
      console.log(`Triggering email for application ${app.id}, status: ${status}, email: ${app.email}`);
      emailService.sendStatusChangeEmail(app.email, status, {
        candidate_name: `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Valued Candidate',
        application_id: String(app.id).padStart(4, '0'),
        job_title: app.job_title || 'General Application',
        updated_date: new Date().toLocaleDateString(),
        status: status,
        remarks: app.remarks || ''
      }).then(result => {
        if (result.success) {
          console.log('Email sent successfully:', result.messageId);
        } else {
          console.error('Email send failed:', result.message);
        }
      }).catch(err => console.error('Email send error:', err));
    }
    
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/applications/:id', requireAuth, async (req, res) => {
  try {
    const applicationId = req.params.id;
    
    // Get application and candidate info before deleting
    const [appRows] = await pool.query(
      'SELECT candidate_id, job_id FROM applications WHERE id = ?', 
      [applicationId]
    );
    
    if (appRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    const { candidate_id, job_id } = appRows[0];
    
    // Get all documents for this specific application to delete files
    const [docs] = await pool.query(
      'SELECT * FROM candidate_documents WHERE candidate_id = ? AND application_id = ?',
      [candidate_id, applicationId]
    );
    
    // Delete physical files if they exist
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
      
      // Delete additional_files if they exist
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
                    console.error(`Failed to delete additional file ${filePath}:`, fileError);
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
    
    // Delete profile image if it exists and is application-specific
    const [profiles] = await pool.query(
      'SELECT profile_image_url FROM healthcare_profiles WHERE candidate_id = ? AND application_id = ?',
      [candidate_id, applicationId]
    );
    
    if (profiles.length > 0 && profiles[0].profile_image_url) {
      const imageUrl = profiles[0].profile_image_url;
      if (imageUrl.startsWith('/uploads/')) {
        const relativePath = imageUrl.substring(1);
        const filePath = path.join(__dirname, '..', relativePath);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted profile image: ${filePath}`);
          } catch (fileError) {
            console.error(`Failed to delete profile image ${filePath}:`, fileError);
          }
        }
      }
    }
    
    // CASCADE DELETE: Delete all application-specific data
    // Order matters: delete child records first, then parent
    
    // 1. Delete documents for this application
    await pool.query(
      'DELETE FROM candidate_documents WHERE candidate_id = ? AND application_id = ?',
      [candidate_id, applicationId]
    );
    
    // 2. Delete work experience for this application
    await pool.query(
      'DELETE FROM work_experience WHERE candidate_id = ? AND application_id = ?',
      [candidate_id, applicationId]
    );
    
    // 3. Delete education records for this application
    await pool.query(
      'DELETE FROM education_records WHERE candidate_id = ? AND application_id = ?',
      [candidate_id, applicationId]
    );
    
    // 4. Delete healthcare profile for this application
    await pool.query(
      'DELETE FROM healthcare_profiles WHERE candidate_id = ? AND application_id = ?',
      [candidate_id, applicationId]
    );
    
    // 5. Finally, delete the application itself
    await pool.query('DELETE FROM applications WHERE id = ?', [applicationId]);
    
    console.log(`Successfully deleted application ${applicationId} and all related data`);
    
    res.json({ success: true, message: 'Application and all related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
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
    
    const [applications] = await pool.query(query, params);
    
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

// Download individual application with all documents
router.get('/applications/:id/download', requireAuth, async (req, res) => {
  try {
    const applicationId = req.params.id;

    // Import necessary modules dynamically
    const PDFDocument = (await import('pdfkit')).default;
    const archiver = (await import('archiver')).default;

    // Fetch application data
    const [applications] = await pool.query(
      'SELECT * FROM applications WHERE id = ?',
      [applicationId]
    );

    if (!applications || applications.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const application = applications[0];

    // Fetch profile, experience, education, and documents
    const [profiles] = await pool.query(
      'SELECT * FROM healthcare_profiles WHERE application_id = ?',
      [applicationId]
    );

    const [experiences] = await pool.query(
      'SELECT * FROM work_experience WHERE application_id = ?',
      [applicationId]
    );

    const [educations] = await pool.query(
      'SELECT * FROM education_records WHERE application_id = ?',
      [applicationId]
    );

    const [docs] = await pool.query(
      'SELECT * FROM candidate_documents WHERE application_id = ?',
      [applicationId]
    );

    const profile = profiles[0] || {};
    const documents = docs[0] || {};

    // Create ZIP archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    res.attachment(`application_${applicationId}.zip`);
    archive.pipe(res);

    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    const pdfBuffers = [];
    
    doc.on('data', (chunk) => pdfBuffers.push(chunk));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(pdfBuffers);
      archive.append(pdfData, { name: `application_${applicationId}.pdf` });

      // Add attached files to ZIP
      const fileFields = [
        { url: documents.cv_resume_url, name: 'CV_Resume.pdf' },
        { url: documents.passport_url, name: 'Passport.pdf' },
        { url: documents.degree_certificates_url, name: 'Degree_Certificates.pdf' },
        { url: documents.license_certificate_url, name: 'License_Certificate.pdf' },
        { url: documents.ielts_oet_certificate_url, name: 'IELTS_OET_Certificate.pdf' },
        { url: documents.experience_letters_url, name: 'Experience_Letters.pdf' }
      ];

      // Add additional files
      if (documents.additional_files) {
        try {
          const additionalFiles = typeof documents.additional_files === 'string' 
            ? JSON.parse(documents.additional_files) 
            : documents.additional_files;
          
          if (Array.isArray(additionalFiles)) {
            additionalFiles.forEach((file, index) => {
              const fileUrl = file.url || file;
              const fileName = file.name || `Additional_Document_${index + 1}`;
              fileFields.push({ url: fileUrl, name: fileName });
            });
          }
        } catch (e) {
          console.error('Error parsing additional files:', e);
        }
      }

      // Download and add files to archive
      for (const field of fileFields) {
        if (field.url) {
          try {
            const filePath = path.join(__dirname, '..', field.url.startsWith('/') ? field.url.substring(1) : field.url);
            if (fs.existsSync(filePath)) {
              const fileData = fs.readFileSync(filePath);
              archive.append(fileData, { name: field.name });
            }
          } catch (error) {
            console.error(`Failed to add ${field.name}:`, error);
          }
        }
      }

      // Finalize the archive
      archive.finalize();
    });

    // Generate PDF content - same as candidate download
    doc.fontSize(20).text('Job Application Details', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Application ID: ${String(applicationId).padStart(6, '0')}`, { align: 'right' });
    doc.text(`Status: ${application.status}`, { align: 'right' });
    doc.text(`Date: ${new Date(application.applied_date).toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    // Personal Information
    const addSection = (doc, title) => {
      doc.fontSize(14).fillColor('#00A6CE').text(title, { underline: true });
      doc.fillColor('black').moveDown(0.5);
    };

    const addField = (doc, label, value) => {
      if (value) {
        doc.fontSize(10).text(`${label}: `, { continued: true })
           .fontSize(10).text(value || 'N/A');
      }
    };

    addSection(doc, 'Personal Information');
    addField(doc, 'First Name', profile.first_name);
    addField(doc, 'Last Name', profile.last_name);
    addField(doc, 'Father\'s/Husband\'s Name', profile.father_husband_name);
    addField(doc, 'Date of Birth', profile.date_of_birth);
    addField(doc, 'Gender', profile.gender);
    addField(doc, 'Marital Status', profile.marital_status);
    addField(doc, 'Religion', profile.religion);
    addField(doc, 'Place of Birth', profile.place_of_birth);
    addField(doc, 'Province', profile.province);
    addField(doc, 'Country', profile.country);
    addField(doc, 'CNIC', profile.cnic);
    addField(doc, 'Passport Number', profile.passport_number);
    addField(doc, 'Email Address', profile.email_address);
    addField(doc, 'Mobile Number', profile.mobile_no);
    doc.moveDown();

    // Work Experience
    addSection(doc, 'Work Experience');
    if (experiences && experiences.length > 0) {
      experiences.forEach((exp, index) => {
        doc.fontSize(11).text(`Experience ${index + 1}:`, { underline: true });
        addField(doc, 'Job Title', exp.job_title);
        addField(doc, 'Employer/Hospital', exp.employer_hospital);
        addField(doc, 'Specialization', exp.specialization);
        addField(doc, 'Total Experience', exp.total_experience);
        doc.moveDown(0.5);
      });
    } else {
      doc.fontSize(10).text('No work experience records', { italics: true });
    }
    doc.moveDown();

    // Education & Certifications
    addSection(doc, 'Education & Certifications');
    if (educations && educations.length > 0) {
      educations.forEach((edu, index) => {
        doc.fontSize(11).text(`Education ${index + 1}:`, { underline: true });
        addField(doc, 'Degree/Diploma Title', edu.degree_diploma_title);
        addField(doc, 'University/Institute', edu.university_institute_name);
        addField(doc, 'Graduation Year', edu.graduation_year);
        addField(doc, 'Registration Number', edu.registration_number);
        doc.moveDown(0.5);
      });
    } else {
      doc.fontSize(10).text('No education records', { italics: true });
    }
    doc.moveDown();

    // Trade Information
    addSection(doc, 'Trade Information');
    addField(doc, 'Trade Applied For', profile.trade_applied_for);
    addField(doc, 'Availability to Join', profile.availability_to_join);
    addField(doc, 'Willingness to Relocate', profile.willingness_to_relocate);

    doc.end();

  } catch (error) {
    console.error('Error generating application download:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to generate application download' });
    }
  }
});

export default router;
