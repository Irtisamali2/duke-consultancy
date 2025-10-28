import db from '../db.js';

export async function addAuditLogging() {
  try {
    console.log('Adding audit logging columns to tables...');
    
    // Add audit columns to blogs table
    const [blogsColumns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'blogs'
    `);
    
    const blogsColumnNames = blogsColumns.map(c => c.COLUMN_NAME);
    
    if (!blogsColumnNames.includes('modified_at')) {
      await db.query(`ALTER TABLE blogs ADD COLUMN modified_at DATETIME DEFAULT NULL`);
      console.log('✓ Added modified_at to blogs');
    }
    
    if (!blogsColumnNames.includes('modified_by')) {
      await db.query(`ALTER TABLE blogs ADD COLUMN modified_by INT DEFAULT NULL`);
      console.log('✓ Added modified_by to blogs');
    }
    
    if (!blogsColumnNames.includes('modified_by_type')) {
      await db.query(`ALTER TABLE blogs ADD COLUMN modified_by_type ENUM('admin', 'system') DEFAULT 'admin'`);
      console.log('✓ Added modified_by_type to blogs');
    }
    
    // Create blog_categories table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS blog_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INT,
        FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Created blog_categories table');
    
    // Insert default categories
    await db.query(`
      INSERT IGNORE INTO blog_categories (name, slug, description) VALUES
      ('Health Tips', 'health-tips', 'Tips and advice for maintaining good health'),
      ('Diet Tips', 'diet-tips', 'Nutrition and diet guidance'),
      ('Career', 'career', 'Career advice and opportunities'),
      ('Documentation', 'documentation', 'Visa and documentation guides'),
      ('General', 'general', 'General healthcare topics')
    `);
    console.log('✓ Inserted default blog categories');
    
    // Add audit columns to candidate_applications table
    const [appColumns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'candidate_applications'
    `);
    
    const appColumnNames = appColumns.map(c => c.COLUMN_NAME);
    
    if (!appColumnNames.includes('modified_at')) {
      await db.query(`ALTER TABLE candidate_applications ADD COLUMN modified_at DATETIME DEFAULT NULL`);
      console.log('✓ Added modified_at to candidate_applications');
    }
    
    if (!appColumnNames.includes('modified_by')) {
      await db.query(`ALTER TABLE candidate_applications ADD COLUMN modified_by INT DEFAULT NULL`);
      console.log('✓ Added modified_by to candidate_applications');
    }
    
    if (!appColumnNames.includes('modified_by_type')) {
      await db.query(`ALTER TABLE candidate_applications ADD COLUMN modified_by_type ENUM('admin', 'candidate') DEFAULT 'candidate'`);
      console.log('✓ Added modified_by_type to candidate_applications');
    }
    
    if (!appColumnNames.includes('submitted_at')) {
      await db.query(`ALTER TABLE candidate_applications ADD COLUMN submitted_at DATETIME DEFAULT NULL`);
      console.log('✓ Added submitted_at to candidate_applications');
    }
    
    // Add audit columns to email_logs table
    const [emailColumns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'email_logs'
    `);
    
    const emailColumnNames = emailColumns.map(c => c.COLUMN_NAME);
    
    if (!emailColumnNames.includes('modified_at')) {
      await db.query(`ALTER TABLE email_logs ADD COLUMN modified_at DATETIME DEFAULT NULL`);
      console.log('✓ Added modified_at to email_logs');
    }
    
    if (!emailColumnNames.includes('modified_by')) {
      await db.query(`ALTER TABLE email_logs ADD COLUMN modified_by INT DEFAULT NULL`);
      console.log('✓ Added modified_by to email_logs');
    }
    
    if (!emailColumnNames.includes('sent_by_type')) {
      await db.query(`ALTER TABLE email_logs ADD COLUMN sent_by_type ENUM('admin', 'system') DEFAULT 'admin'`);
      console.log('✓ Added sent_by_type to email_logs');
    }
    
    console.log('✓ Audit logging setup complete');
  } catch (error) {
    console.error('Audit logging migration error:', error.message);
  }
}
