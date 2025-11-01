import db from './db.js';

async function fixEmailTemplates() {
  try {
    console.log('Checking email templates...');
    
    // Get all current templates
    const [existingTemplates] = await db.query('SELECT template_key, template_name FROM email_templates');
    console.log('\nExisting templates:');
    existingTemplates.forEach(t => console.log(`- ${t.template_key}: ${t.template_name}`));
    
    // Define templates to keep
    const templatesToKeep = [
      'application_received',
      'status_pending',
      'status_verified',
      'status_approved',
      'status_rejected',
      'password_reset'
    ];
    
    // Delete templates that are not in the keep list (except custom/reminder types)
    const existingKeys = existingTemplates.map(t => t.template_key);
    const toDelete = existingKeys.filter(key => 
      !templatesToKeep.includes(key) && 
      !key.includes('custom') && 
      !key.includes('reminder')
    );
    
    if (toDelete.length > 0) {
      console.log('\nDeleting old templates:', toDelete);
      for (const key of toDelete) {
        await db.query('DELETE FROM email_templates WHERE template_key = ?', [key]);
        console.log(`Deleted: ${key}`);
      }
    }
    
    // Check if status_pending exists
    const [pendingTemplate] = await db.query(
      'SELECT id FROM email_templates WHERE template_key = ?',
      ['status_pending']
    );
    
    if (pendingTemplate.length === 0) {
      console.log('\nAdding missing status_pending template...');
      await db.query(
        `INSERT INTO email_templates (template_key, template_name, subject, body, variables, description) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          'status_pending',
          'Application Under Review',
          'Application Under Review - Duke Consultancy',
          `<p>Dear {{candidate_name}},</p>
<p>Thank you for submitting your application to Duke Consultancy.</p>
<p>Your application is currently under review by our team.</p>
<p><strong>Application Details:</strong></p>
<ul>
<li>Application ID: {{application_id}}</li>
<li>Job Applied For: {{job_title}}</li>
<li>Status: Under Review</li>
<li>Updated On: {{updated_date}}</li>
</ul>
<p>We will notify you once our review is complete. Thank you for your patience.</p>
<p>Best regards,<br>Duke Consultancy Team</p>`,
          '{{candidate_name}}, {{application_id}}, {{job_title}}, {{updated_date}}',
          'Sent when application status changes to pending'
        ]
      );
      console.log('Added status_pending template');
    } else {
      console.log('\nstatus_pending template already exists');
    }
    
    // Show final list
    const [finalTemplates] = await db.query('SELECT template_key, template_name FROM email_templates ORDER BY template_key');
    console.log('\nFinal templates:');
    finalTemplates.forEach(t => console.log(`- ${t.template_key}: ${t.template_name}`));
    
    console.log('\n✅ Email templates fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing templates:', error);
    process.exit(1);
  }
}

fixEmailTemplates();
