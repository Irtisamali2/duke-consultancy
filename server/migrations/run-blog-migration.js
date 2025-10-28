import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: '51.68.193.188',
  user: 'hazzains_duke_admin',
  password: 'f3e}N@2nT.mL',
  database: 'hazzains_duke_admin'
});

try {
  console.log('Adding excerpt and featured_image columns to blogs table...');
  
  // Check if columns exist
  const [columns] = await connection.query(`
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'hazzains_duke_admin' 
    AND TABLE_NAME = 'blogs'
  `);
  
  const columnNames = columns.map(c => c.COLUMN_NAME);
  
  if (!columnNames.includes('excerpt')) {
    await connection.query(`ALTER TABLE blogs ADD COLUMN excerpt TEXT AFTER content`);
    console.log('Added excerpt column');
  } else {
    console.log('excerpt column already exists');
  }
  
  if (!columnNames.includes('featured_image')) {
    await connection.query(`ALTER TABLE blogs ADD COLUMN featured_image VARCHAR(500) AFTER content`);
    console.log('Added featured_image column');
  } else {
    console.log('featured_image column already exists');
  }
  
  console.log('Migration completed successfully!');
} catch (error) {
  console.error('Migration failed:', error);
} finally {
  await connection.end();
}
