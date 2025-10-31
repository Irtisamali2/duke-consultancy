import db from '../db.js';

export async function fixWillingnessRelocateEnum() {
  try {
    console.log('Fixing willingness_to_relocate ENUM to include Maybe...');
    
    // First, update the column to VARCHAR temporarily to allow all values
    await db.query(`
      ALTER TABLE healthcare_profiles 
      MODIFY COLUMN willingness_to_relocate VARCHAR(10)
    `);
    
    // Update existing lowercase values to capitalized
    await db.query(`
      UPDATE healthcare_profiles 
      SET willingness_to_relocate = 'Yes' 
      WHERE LOWER(willingness_to_relocate) = 'yes'
    `);
    
    await db.query(`
      UPDATE healthcare_profiles 
      SET willingness_to_relocate = 'No' 
      WHERE LOWER(willingness_to_relocate) = 'no'
    `);
    
    // Now change it to ENUM with the correct values
    await db.query(`
      ALTER TABLE healthcare_profiles 
      MODIFY COLUMN willingness_to_relocate ENUM('Yes', 'No', 'Maybe')
    `);
    
    console.log('Successfully fixed willingness_to_relocate ENUM');
  } catch (error) {
    console.log('Note: willingness_to_relocate ENUM may already be fixed or error:', error.message);
  }
}
