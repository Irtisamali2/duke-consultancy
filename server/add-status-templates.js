import db from './db.js';

async function addStatusTemplates() {
  try {
    console.log('Adding status email templates...\n');
    
    const templates = [
      {
        key: 'status_verified',
        name: 'Application Verified',
        subject: 'Application Verified - Duke Consultancy',
        body: `<p>Dear {{candidate_name}},</p>
<p>Great news! Your application has been verified by our team.</p>
<p><strong>Application Details:</strong></p>
<ul>
<li>Application ID: {{application_id}}</li>
<li>Job Applied For: {{job_title}}</li>
<li>Status: Verified</li>
<li>Updated On: {{updated_date}}</li>
</ul>
<p>Our team will proceed with the next steps. You will receive further updates via email.</p>
<p>Best regards,<br>Duke Consultancy Team</p>`,
        variables: '{{candidate_name}}, {{application_id}}, {{job_title}}, {{updated_date}}',
        description: 'Sent when application status changes to verified'
      },
      {
        key: 'status_approved',
        name: 'Application Approved - Congratulations!',
        subject: 'Application Approved - Duke Consultancy',
        body: `<p>Dear {{candidate_name}},</p>
<p>Congratulations! We are pleased to inform you that your application has been approved.</p>
<p><strong>Application Details:</strong></p>
<ul>
<li>Application ID: {{application_id}}</li>
<li>Job Applied For: {{job_title}}</li>
<li>Status: Approved</li>
<li>Updated On: {{updated_date}}</li>
</ul>
<p>Our team will contact you soon with the next steps for your placement.</p>
<p>Best regards,<br>Duke Consultancy Team</p>`,
        variables: '{{candidate_name}}, {{application_id}}, {{job_title}}, {{updated_date}}',
        description: 'Sent when application is approved'
      },
      {
        key: 'status_rejected',
        name: 'Application Status Update',
        subject: 'Application Status Update - Duke Consultancy',
        body: `<p>Dear {{candidate_name}},</p>
<p>Thank you for your interest in Duke Consultancy.</p>
<p>After careful review, we regret to inform you that we are unable to proceed with your application at this time.</p>
<p><strong>Application Details:</strong></p>
<ul>
<li>Application ID: {{application_id}}</li>
<li>Job Applied For: {{job_title}}</li>
<li>Status: Not Selected</li>
<li>Updated On: {{updated_date}}</li>
</ul>
{{#if remarks}}<p><strong>Additional Notes:</strong> {{remarks}}</p>{{/if}}
<p>We encourage you to apply again in the future when new opportunities arise.</p>
<p>Best regards,<br>Duke Consultancy Team</p>`,
        variables: '{{candidate_name}}, {{application_id}}, {{job_title}}, {{updated_date}}, {{remarks}}',
        description: 'Sent when application is rejected'
      }
    ];
    
    for (const template of templates) {
      // Check if exists
      const [existing] = await db.query(
        'SELECT id FROM email_templates WHERE template_key = ?',
        [template.key]
      );
      
      if (existing.length > 0) {
        console.log(`Updating ${template.key}...`);
        await db.query(
          'UPDATE email_templates SET template_name = ?, subject = ?, body = ?, variables = ?, description = ? WHERE template_key = ?',
          [template.name, template.subject, template.body, template.variables, template.description, template.key]
        );
      } else {
        console.log(`Adding ${template.key}...`);
        await db.query(
          'INSERT INTO email_templates (template_key, template_name, subject, body, variables, description) VALUES (?, ?, ?, ?, ?, ?)',
          [template.key, template.name, template.subject, template.body, template.variables, template.description]
        );
      }
    }
    
    // Show all templates
    const [allTemplates] = await db.query('SELECT template_key, template_name FROM email_templates ORDER BY template_key');
    console.log('\n✅ All email templates:');
    allTemplates.forEach(t => console.log(`- ${t.template_key}: ${t.template_name}`));
    
    console.log('\n✅ Status templates added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding templates:', error);
    process.exit(1);
  }
}

addStatusTemplates();
