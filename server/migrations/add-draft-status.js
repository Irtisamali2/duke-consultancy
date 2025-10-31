import db from '../db.js';

export async function addDraftStatus() {
  try {
    console.log('Adding draft status to applications table...');

    // Check if draft is already in the ENUM
    const [columns] = await db.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'applications' 
      AND COLUMN_NAME = 'status'
      AND TABLE_SCHEMA = DATABASE()
    `);

    if (columns.length > 0) {
      const columnType = columns[0].COLUMN_TYPE;
      if (columnType.includes("'draft'")) {
        console.log('✓ Draft status already exists in applications table');
        return;
      }
    }

    // Add 'draft' to the ENUM
    await db.query(`
      ALTER TABLE applications 
      MODIFY COLUMN status ENUM('draft', 'pending', 'verified', 'rejected', 'approved') DEFAULT 'pending'
    `);
    
    console.log('✓ Added draft status to applications table');
  } catch (error) {
    if (error.message.includes('Duplicate')) {
      console.log('✓ Draft status already exists in applications table');
    } else {
      console.error('Error adding draft status:', error);
      throw error;
    }
  }
}
