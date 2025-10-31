import pool from './db.js';

async function checkApplicationData() {
  try {
    const applicationId = 26;
    
    console.log(`\n=== Checking Application ${applicationId} ===\n`);
    
    // Check application
    const [apps] = await pool.query('SELECT * FROM applications WHERE id = ?', [applicationId]);
    console.log('Application:', apps[0] ? 'Found' : 'NOT FOUND');
    if (apps[0]) {
      console.log('  - Candidate ID:', apps[0].candidate_id);
      console.log('  - Job ID:', apps[0].job_id);
      console.log('  - Status:', apps[0].status);
    }
    
    // Check healthcare profile
    const [profiles] = await pool.query('SELECT * FROM healthcare_profiles WHERE application_id = ?', [applicationId]);
    console.log('\nHealthcare Profile:', profiles[0] ? 'Found' : 'NOT FOUND');
    if (profiles[0]) {
      console.log('  - Profile Image URL:', profiles[0].profile_image_url || 'NONE');
      console.log('  - First Name:', profiles[0].first_name);
      console.log('  - Last Name:', profiles[0].last_name);
    }
    
    // Check documents
    const [docs] = await pool.query('SELECT * FROM candidate_documents WHERE application_id = ?', [applicationId]);
    console.log('\nCandidate Documents:', docs[0] ? 'Found' : 'NOT FOUND');
    if (docs[0]) {
      console.log('  - CV Resume URL:', docs[0].cv_resume_url || 'NONE');
      console.log('  - Passport URL:', docs[0].passport_url || 'NONE');
      console.log('  - Degree Certificates URL:', docs[0].degree_certificates_url || 'NONE');
      console.log('  - License Certificate URL:', docs[0].license_certificate_url || 'NONE');
      console.log('  - IELTS/OET Certificate URL:', docs[0].ielts_oet_certificate_url || 'NONE');
      console.log('  - Experience Letters URL:', docs[0].experience_letters_url || 'NONE');
      console.log('  - Additional Files:', docs[0].additional_files || 'NONE');
    }
    
    // Check education
    const [edu] = await pool.query('SELECT COUNT(*) as count FROM education_records WHERE application_id = ?', [applicationId]);
    console.log('\nEducation Records:', edu[0].count);
    
    // Check experience
    const [exp] = await pool.query('SELECT COUNT(*) as count FROM work_experience WHERE application_id = ?', [applicationId]);
    console.log('Work Experience Records:', exp[0].count);
    
    console.log('\n');
    process.exit(0);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkApplicationData();
