import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '51.68.193.188',
  user: 'hazzains_user',
  password: 'A5N)J!f,A5gJrn',
  database: 'hazzains_duke_admin',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function fixDocuments() {
  try {
    console.log('Connecting to database...');
    
    // First, check what document data exists
    console.log('\n=== Checking existing document data ===');
    const [docs] = await pool.query(
      'SELECT * FROM candidate_documents WHERE candidate_id = 5'
    );
    console.log('Found documents:', docs);
    
    // Check application #22
    console.log('\n=== Checking application #22 ===');
    const [app] = await pool.query(
      'SELECT * FROM applications WHERE id = 22'
    );
    console.log('Application #22:', app);
    
    // Fix orphaned documents by linking them to application #22
    console.log('\n=== Linking orphaned data to application #22 ===');
    
    await pool.query(
      'UPDATE healthcare_profiles SET application_id = 22 WHERE candidate_id = 5 AND application_id IS NULL'
    );
    console.log('✓ Updated healthcare_profiles');
    
    await pool.query(
      'UPDATE education_records SET application_id = 22 WHERE candidate_id = 5 AND application_id IS NULL'
    );
    console.log('✓ Updated education_records');
    
    await pool.query(
      'UPDATE work_experience SET application_id = 22 WHERE candidate_id = 5 AND application_id IS NULL'
    );
    console.log('✓ Updated work_experience');
    
    await pool.query(
      'UPDATE candidate_documents SET application_id = 22 WHERE candidate_id = 5 AND application_id IS NULL'
    );
    console.log('✓ Updated candidate_documents');
    
    // Verify the fix
    console.log('\n=== Verifying fix ===');
    const [fixedDocs] = await pool.query(
      'SELECT * FROM candidate_documents WHERE candidate_id = 5 AND application_id = 22'
    );
    console.log('Documents now linked to application #22:', fixedDocs);
    
    const [profile] = await pool.query(
      'SELECT * FROM healthcare_profiles WHERE candidate_id = 5 AND application_id = 22'
    );
    console.log('\nProfile data for application #22:', profile);
    
    console.log('\n✅ All data successfully linked to application #22!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

fixDocuments();
