import db from './db.js';
import fs from 'fs';

async function runMigration() {
  try {
    console.log('Creating email_logs table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recipient_email VARCHAR(255) NOT NULL,
        recipient_name VARCHAR(255),
        subject VARCHAR(500) NOT NULL,
        body TEXT NOT NULL,
        template_id INT,
        application_id INT,
        status ENUM('sent', 'failed', 'pending') DEFAULT 'pending',
        error_message TEXT,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_recipient_email (recipient_email),
        INDEX idx_application_id (application_id),
        INDEX idx_sent_at (sent_at)
      )
    `);
    console.log('✓ email_logs table created');

    console.log('Creating incoming_emails table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS incoming_emails (
        id INT AUTO_INCREMENT PRIMARY KEY,
        from_email VARCHAR(255) NOT NULL,
        from_name VARCHAR(255),
        to_email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        body TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        application_id INT,
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_from_email (from_email),
        INDEX idx_is_read (is_read),
        INDEX idx_received_at (received_at)
      )
    `);
    console.log('✓ incoming_emails table created');

    console.log('Adding reminder email template...');
    const reminderBody = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><div style="background: #00A6CE; color: white; padding: 20px; text-align: center;"><h1>Duke Consultancy</h1></div><div style="padding: 20px; background: #f9f9f9;"><p>Dear {{candidate_name}},</p><p>This is a friendly reminder regarding your application with Duke Consultancy.</p><p><strong>Application Details:</strong></p><ul><li>Application ID: {{application_id}}</li><li>Trade/Position: {{trade}}</li><li>Current Status: {{status}}</li></ul><p>If you have any questions or need assistance, please contact us.</p><p>Best regards,<br>Duke Consultancy Team</p></div><div style="padding: 20px; text-align: center; font-size: 12px; color: #666;"><p>Copyright 2025 Duke Consultancy. All rights reserved.</p></div></div>';
    
    await db.query(
      `INSERT INTO email_templates (template_key, template_name, subject, body, variables, description) VALUES (?, ?, ?, ?, ?, ?)`,
      ['reminder', 'Application Reminder', 'Reminder: Complete Your Application - Duke Consultancy', reminderBody, '{{candidate_name}}, {{application_id}}, {{trade}}, {{status}}', 'Reminder email for candidates']
    );
    console.log('✓ Reminder template created');

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    if (error.message.includes('Duplicate entry')) {
      console.log('⚠ Reminder template already exists, skipping...');
      console.log('✅ Migration completed successfully!');
      process.exit(0);
    } else {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  }
}

runMigration();
