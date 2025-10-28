import db from '../db.js';

export async function ensureGeneralJob() {
  try {
    console.log('Ensuring General Application job exists...');
    
    const [existing] = await db.query(
      'SELECT id FROM jobs WHERE title = ? AND job_type = ?',
      ['General Application', 'general']
    );
    
    if (existing.length === 0) {
      await db.query(
        `INSERT INTO jobs (title, description, location, country, job_type, specialization, experience_required, salary_range, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'General Application',
          'Submit your general application to be considered for various healthcare opportunities.',
          'Various',
          'Multiple Countries',
          'general',
          'All Specializations',
          'Any',
          'Competitive',
          'active'
        ]
      );
      console.log('✓ Created General Application job');
    } else {
      console.log('✓ General Application job already exists');
    }
  } catch (error) {
    console.error('Error ensuring General Application job:', error);
  }
}
