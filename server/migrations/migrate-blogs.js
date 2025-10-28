import db from '../db.js';

export async function migrateBlogsTable() {
  try {
    console.log('Checking blogs table schema...');
    
    // Check if excerpt column exists
    const [excerptCheck] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'blogs' 
      AND COLUMN_NAME = 'excerpt'
    `);
    
    if (excerptCheck.length === 0) {
      console.log('Adding excerpt column to blogs table...');
      await db.query(`ALTER TABLE blogs ADD COLUMN excerpt TEXT AFTER content`);
      console.log('✓ Added excerpt column');
    }
    
    // Check if featured_image column exists
    const [imageCheck] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'blogs' 
      AND COLUMN_NAME = 'featured_image'
    `);
    
    if (imageCheck.length === 0) {
      console.log('Adding featured_image column to blogs table...');
      await db.query(`ALTER TABLE blogs ADD COLUMN featured_image VARCHAR(500) AFTER excerpt`);
      console.log('✓ Added featured_image column');
    }
    
    console.log('✓ Blogs table schema is up to date');
  } catch (error) {
    console.error('Migration error:', error.message);
  }
}
