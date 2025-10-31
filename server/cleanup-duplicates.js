import pool from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cleanupDuplicates() {
  try {
    console.log('Starting duplicate application cleanup...\n');
    
    // Find all duplicate applications (same candidate_id + job_id)
    const [duplicates] = await pool.query(`
      SELECT candidate_id, job_id, GROUP_CONCAT(id ORDER BY id) as application_ids, COUNT(*) as count
      FROM applications
      GROUP BY candidate_id, job_id
      HAVING COUNT(*) > 1
    `);
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicate applications found!');
      process.exit(0);
    }
    
    console.log(`Found ${duplicates.length} sets of duplicate applications:\n`);
    
    let totalDeleted = 0;
    
    for (const dup of duplicates) {
      const appIds = dup.application_ids.split(',').map(id => parseInt(id));
      const keepId = Math.max(...appIds); // Keep the most recent (highest ID)
      const deleteIds = appIds.filter(id => id !== keepId);
      
      console.log(`Candidate ${dup.candidate_id}, Job ${dup.job_id}:`);
      console.log(`  - Keeping application ${keepId}`);
      console.log(`  - Deleting applications: ${deleteIds.join(', ')}`);
      
      // Delete each duplicate application with full cascade
      for (const appId of deleteIds) {
        await deleteCascade(appId);
        totalDeleted++;
      }
      
      console.log('');
    }
    
    console.log(`\n✅ Cleanup complete! Deleted ${totalDeleted} duplicate applications.`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

async function deleteCascade(applicationId) {
  try {
    // Get application and candidate info
    const [appRows] = await pool.query(
      'SELECT candidate_id, job_id FROM applications WHERE id = ?', 
      [applicationId]
    );
    
    if (appRows.length === 0) {
      console.log(`  ⚠️  Application ${applicationId} not found, skipping`);
      return;
    }
    
    const { candidate_id } = appRows[0];
    
    // Get all documents for this specific application to delete files
    const [docs] = await pool.query(
      'SELECT * FROM candidate_documents WHERE candidate_id = ? AND application_id = ?',
      [candidate_id, applicationId]
    );
    
    // Delete physical files
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
            } catch (err) {
              // Silent fail for files
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
                  } catch (err) {
                    // Silent fail
                  }
                }
              }
            }
          }
        } catch (err) {
          // Silent fail
        }
      }
    }
    
    // Delete profile image
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
          } catch (err) {
            // Silent fail
          }
        }
      }
    }
    
    // CASCADE DELETE database records
    await pool.query(
      'DELETE FROM candidate_documents WHERE candidate_id = ? AND application_id = ?',
      [candidate_id, applicationId]
    );
    
    await pool.query(
      'DELETE FROM work_experience WHERE candidate_id = ? AND application_id = ?',
      [candidate_id, applicationId]
    );
    
    await pool.query(
      'DELETE FROM education_records WHERE candidate_id = ? AND application_id = ?',
      [candidate_id, applicationId]
    );
    
    await pool.query(
      'DELETE FROM healthcare_profiles WHERE candidate_id = ? AND application_id = ?',
      [candidate_id, applicationId]
    );
    
    await pool.query('DELETE FROM applications WHERE id = ?', [applicationId]);
    
    console.log(`  ✓ Deleted application ${applicationId} and all related data`);
    
  } catch (error) {
    console.error(`  ❌ Error deleting application ${applicationId}:`, error.message);
  }
}

// Run cleanup
cleanupDuplicates();
