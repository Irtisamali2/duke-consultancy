import express from 'express';
import PDFDocument from 'pdfkit';
import archiver from 'archiver';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Admin download application as PDF with attached files
router.get('/admin/applications/:applicationId/download', requireAuth, async (req, res) => {
  try {
    const { applicationId } = req.params;

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

      // Download and add files to archive
      for (const field of fileFields) {
        if (field.url) {
          try {
            const fileData = await downloadFile(field.url);
            if (fileData) {
              archive.append(fileData, { name: field.name });
            }
          } catch (error) {
            console.error(`Failed to download ${field.name}:`, error);
          }
        }
      }

      // Finalize the archive
      archive.finalize();
    });

    // Generate PDF content
    doc.fontSize(20).text('Job Application Details', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Application ID: ${String(applicationId).padStart(6, '0')}`, { align: 'right' });
    doc.text(`Status: ${application.status}`, { align: 'right' });
    doc.text(`Date: ${new Date(application.applied_date).toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    // Personal Information
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
    addField(doc, 'CNIC Issue Date', profile.cnic_issue_date);
    addField(doc, 'CNIC Expiry Date', profile.cnic_expire_date);
    addField(doc, 'Passport Number', profile.passport_number);
    addField(doc, 'Passport Issue Date', profile.passport_issue_date);
    addField(doc, 'Passport Expiry Date', profile.passport_expire_date);
    addField(doc, 'Email Address', profile.email_address);
    addField(doc, 'Mobile Number', profile.mobile_no);
    addField(doc, 'Office Tel No', profile.tel_off_no);
    addField(doc, 'Residence Tel No', profile.tel_res_no);
    addField(doc, 'Present Address', profile.present_address ? `${profile.present_address}, ${profile.present_street || ''}, ${profile.present_postal_code || ''}` : '');
    addField(doc, 'Permanent Address', profile.permanent_address ? `${profile.permanent_address}, ${profile.permanent_street || ''}, ${profile.permanent_postal_code || ''}` : '');

    doc.moveDown();

    // Work Experience
    addSection(doc, 'Work Experience');
    if (experiences && experiences.length > 0) {
      experiences.forEach((exp, index) => {
        doc.fontSize(11).text(`Experience ${index + 1}:`, { underline: true });
        addField(doc, 'Job Title', exp.job_title);
        addField(doc, 'Employer/Hospital', exp.employer_hospital);
        addField(doc, 'Specialization', exp.specialization);
        addField(doc, 'From Date', exp.from_date);
        addField(doc, 'To Date', exp.to_date);
        addField(doc, 'Total Experience', exp.total_experience);
        doc.moveDown(0.5);
      });
    } else {
      doc.fontSize(10).text('No work experience', { italics: true });
    }

    doc.moveDown();

    // Education
    addSection(doc, 'Education & Certifications');
    if (educations && educations.length > 0) {
      educations.forEach((edu, index) => {
        doc.fontSize(11).text(`Education ${index + 1}:`, { underline: true });
        addField(doc, 'Degree/Diploma Title', edu.degree_diploma_title);
        addField(doc, 'University/Institute', edu.university_institute_name);
        addField(doc, 'Graduation Year', edu.graduation_year);
        addField(doc, 'Program Duration', edu.program_duration);
        addField(doc, 'Registration Number', edu.registration_number);
        addField(doc, 'Marks/Percentage', edu.marks_percentage);
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
    
    try {
      const countries = profile.countries_preference ? JSON.parse(profile.countries_preference) : [];
      addField(doc, 'Country Preferences', Array.isArray(countries) ? countries.join(', ') : '');
      
      const trades = profile.trades_preference ? JSON.parse(profile.trades_preference) : [];
      addField(doc, 'Trade Preferences', Array.isArray(trades) ? trades.join(', ') : '');
    } catch (e) {
      addField(doc, 'Country Preferences', '');
      addField(doc, 'Trade Preferences', '');
    }

    doc.moveDown();

    // Documents
    addSection(doc, 'Attached Documents');
    doc.fontSize(10).text('The following documents are attached to this application:', { italics: true });
    doc.moveDown(0.5);
    
    const docList = [
      { label: 'CV/Resume', url: documents.cv_resume_url },
      { label: 'Passport', url: documents.passport_url },
      { label: 'Degree Certificates', url: documents.degree_certificates_url },
      { label: 'License Certificate', url: documents.license_certificate_url },
      { label: 'IELTS/OET Certificate', url: documents.ielts_oet_certificate_url },
      { label: 'Experience Letters', url: documents.experience_letters_url }
    ];

    docList.forEach(item => {
      if (item.url) {
        doc.fontSize(10).text(`✓ ${item.label}`);
      }
    });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Error generating application download:', error);
    res.status(500).json({ success: false, message: 'Failed to generate application download' });
  }
});

// Helper function to add section headers
function addSection(doc, title) {
  doc.fontSize(14).fillColor('#00A6CE').text(title, { underline: true });
  doc.fillColor('black').moveDown(0.5);
}

// Helper function to add fields
function addField(doc, label, value) {
  if (value) {
    doc.fontSize(10).text(`${label}: `, { continued: true, bold: true })
       .fontSize(10).text(value || 'N/A');
  }
}

// Helper function to download files from URL or local path
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
      const filePath = path.join(__dirname, '..', url.startsWith('/') ? url.substring(1) : url);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error(`Error reading local file ${filePath}:`, err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    } else {
      reject(new Error('Only local file paths are supported'));
    }
  });
}

export default router;
