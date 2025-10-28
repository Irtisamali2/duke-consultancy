import db from '../db.js';

async function addCompanySettings() {
  try {
    console.log('Creating company settings tables...');

    // Create company_settings table
    await db.query(`
      CREATE TABLE IF NOT EXISTS company_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        updated_by INT,
        FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Created company_settings table');

    // Create testimonials table
    await db.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        role VARCHAR(200),
        image_url VARCHAR(500),
        testimonial_text TEXT NOT NULL,
        display_order INT DEFAULT 0,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Created testimonials table');

    // Create social_links table
    await db.query(`
      CREATE TABLE IF NOT EXISTS social_links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        platform_name VARCHAR(100) NOT NULL,
        platform_url VARCHAR(500) NOT NULL,
        icon_class VARCHAR(100),
        display_order INT DEFAULT 0,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Created social_links table');

    // Create contact_leads table
    await db.query(`
      CREATE TABLE IF NOT EXISTS contact_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL,
        phone VARCHAR(50),
        message TEXT NOT NULL,
        status ENUM('new', 'read', 'contacted', 'closed') DEFAULT 'new',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created contact_leads table');

    // Insert default company settings
    await db.query(`
      INSERT IGNORE INTO company_settings (setting_key, setting_value) VALUES
      ('company_name', 'Duke Consultancy'),
      ('company_email', 'info@dukeconsultancy.com'),
      ('company_phone', '+92 300 1234567'),
      ('company_address', '123 Healthcare Plaza, Lahore, Pakistan'),
      ('business_hours', 'Monday - Friday: 9:00 AM - 6:00 PM'),
      ('map_latitude', '31.5204'),
      ('map_longitude', '74.3587'),
      ('map_embed_url', '')
    `);
    console.log('✓ Inserted default company settings');

    // Insert default testimonials (from existing hardcoded data)
    await db.query(`
      INSERT IGNORE INTO testimonials (id, name, role, image_url, testimonial_text, display_order, status) VALUES
      (1, 'Dr. Ahmed Malik', 'Registered Nurse in London', '/testimonial-doctor.jpg', 'The guidance I received from Duke Consultancy was exceptional. They helped me navigate the complex visa process and secure a position at a leading hospital in London. Highly recommended!', 1, 'active'),
      (2, 'Ayesha Rahman', 'Healthcare Professional in Germany', '/testimonial-nurse1.jpg', 'Duke Consultancy made my dream of working abroad a reality. Their team was professional, supportive, and guided me through every step of the application process.', 2, 'active'),
      (3, 'Zainab Hussain', 'Nurse Practitioner in UAE', '/testimonial-nurse2.jpg', 'I''m grateful for the comprehensive support Duke Consultancy provided. From training to placement, they were with me every step of the way. Now I''m successfully working in Dubai!', 3, 'active')
    `);
    console.log('✓ Inserted default testimonials');

    // Insert default social links (from existing footer)
    await db.query(`
      INSERT IGNORE INTO social_links (id, platform_name, platform_url, icon_class, display_order, status) VALUES
      (1, 'Facebook', 'https://facebook.com/dukeconsultancy', 'facebook', 1, 'active'),
      (2, 'Twitter', 'https://twitter.com/dukeconsultancy', 'twitter', 2, 'active'),
      (3, 'Instagram', 'https://instagram.com/dukeconsultancy', 'instagram', 3, 'active')
    `);
    console.log('✓ Inserted default social links');

    console.log('✓ Company settings migration complete');
  } catch (error) {
    console.error('Error in company settings migration:', error);
    throw error;
  }
}

export default addCompanySettings;
