import db from '../db.js';

export async function linkProfilesToApplications() {
  try {
    console.log('Linking profile data to specific applications...');

    // Check if application_id column already exists
    const [healthcareColumns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'healthcare_profiles' 
      AND COLUMN_NAME = 'application_id'
      AND TABLE_SCHEMA = DATABASE()
    `);

    if (healthcareColumns.length > 0) {
      console.log('✓ Profiles already linked to applications');
      return;
    }

    // Add application_id to healthcare_profiles
    await db.query(`
      ALTER TABLE healthcare_profiles 
      ADD COLUMN application_id INT DEFAULT NULL AFTER candidate_id,
      ADD COLUMN middle_name VARCHAR(255) AFTER first_name
    `);
    console.log('✓ Added application_id to healthcare_profiles');

    await db.query(`
      ALTER TABLE healthcare_profiles 
      ADD FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    `);

    // Add application_id to education_records
    await db.query(`
      ALTER TABLE education_records 
      ADD COLUMN application_id INT DEFAULT NULL AFTER candidate_id
    `);
    console.log('✓ Added application_id to education_records');

    await db.query(`
      ALTER TABLE education_records 
      ADD FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    `);

    // Add application_id to work_experience
    await db.query(`
      ALTER TABLE work_experience 
      ADD COLUMN application_id INT DEFAULT NULL AFTER candidate_id
    `);
    console.log('✓ Added application_id to work_experience');

    await db.query(`
      ALTER TABLE work_experience 
      ADD FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    `);

    // Add application_id to candidate_documents
    await db.query(`
      ALTER TABLE candidate_documents 
      ADD COLUMN application_id INT DEFAULT NULL AFTER candidate_id
    `);
    console.log('✓ Added application_id to candidate_documents');

    await db.query(`
      ALTER TABLE candidate_documents 
      ADD FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    `);

    // Add indexes for better performance
    await db.query(`
      CREATE INDEX idx_healthcare_profiles_application ON healthcare_profiles(application_id)
    `);
    await db.query(`
      CREATE INDEX idx_education_records_application ON education_records(application_id)
    `);
    await db.query(`
      CREATE INDEX idx_work_experience_application ON work_experience(application_id)
    `);
    await db.query(`
      CREATE INDEX idx_candidate_documents_application ON candidate_documents(application_id)
    `);
    console.log('✓ Added indexes for application_id');

    console.log('✓ Profile data successfully linked to applications');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME' || error.message.includes('Duplicate column')) {
      console.log('✓ Profiles already linked to applications');
    } else {
      console.error('Error linking profiles to applications:', error);
      throw error;
    }
  }
}
