import db from '../db.js';

export async function addTagsColumn() {
  try {
    console.log('Checking blogs table for tags column...');
    
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'blogs'
    `);
    
    const columnNames = columns.map(c => c.COLUMN_NAME);
    
    if (!columnNames.includes('tags')) {
      await db.query(`ALTER TABLE blogs ADD COLUMN tags TEXT DEFAULT NULL`);
      console.log('✓ Added tags column to blogs table');
    } else {
      console.log('✓ Tags column already exists in blogs table');
    }
    
    if (!columnNames.includes('categories')) {
      await db.query(`ALTER TABLE blogs ADD COLUMN categories TEXT DEFAULT NULL`);
      console.log('✓ Added categories column to blogs table');
    } else {
      console.log('✓ Categories column already exists in blogs table');
    }
  } catch (error) {
    console.error('Error adding tags column:', error.message);
  }
}
