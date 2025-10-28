import db from '../db.js';

export async function migrateProfileImageAndJobDates() {
  try {
    console.log('Adding profile_image_url to healthcare_profiles...');
    await db.query(`
      ALTER TABLE healthcare_profiles 
      ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500) DEFAULT NULL
    `);
    console.log('✓ Added profile_image_url column');

    console.log('Adding active_from and active_to to jobs...');
    await db.query(`
      ALTER TABLE jobs 
      ADD COLUMN IF NOT EXISTS active_from DATE DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS active_to DATE DEFAULT NULL
    `);
    console.log('✓ Added active_from and active_to columns');

    console.log('Adding unique constraint on applications (candidate_id, job_id)...');
    
    const [existingConstraint] = await db.query(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
      WHERE TABLE_NAME = 'applications' 
      AND CONSTRAINT_NAME = 'unique_candidate_job'
    `);
    
    if (existingConstraint.length === 0) {
      await db.query(`
        ALTER TABLE applications 
        ADD CONSTRAINT unique_candidate_job UNIQUE (candidate_id, job_id)
      `);
      console.log('✓ Added unique constraint on (candidate_id, job_id)');
    } else {
      console.log('✓ Unique constraint already exists');
    }

    console.log('✓ Profile image and job dates migration complete');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}
