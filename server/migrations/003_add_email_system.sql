-- SMTP Configuration Table
CREATE TABLE IF NOT EXISTS smtp_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  smtp_host VARCHAR(255) NOT NULL,
  smtp_port INT NOT NULL,
  smtp_secure BOOLEAN DEFAULT true,
  smtp_user VARCHAR(255) NOT NULL,
  smtp_password VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_key VARCHAR(100) UNIQUE NOT NULL,
  template_name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  variables TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default email templates
INSERT INTO email_templates (template_key, template_name, subject, body, variables, description) VALUES
('application_received', 'Application Received', 'Application Received - Duke Consultancy', 
'<p>Dear {{candidate_name}},</p>
<p>Thank you for submitting your application to Duke Consultancy.</p>
<p>We have received your application and our team will review it shortly. You will receive updates via email as your application progresses through our review process.</p>
<p><strong>Application Details:</strong></p>
<ul>
<li>Application ID: {{application_id}}</li>
<li>Applied For: {{trade}}</li>
<li>Submitted On: {{submitted_date}}</li>
<li>Current Status: Pending Review</li>
</ul>
<p>If you have any questions, please don''t hesitate to contact us.</p>
<p>Best regards,<br>Duke Consultancy Team</p>',
'{{candidate_name}}, {{application_id}}, {{trade}}, {{submitted_date}}',
'Sent when candidate submits application'),

('status_verified', 'Application Verified', 'Application Verified - Duke Consultancy',
'<p>Dear {{candidate_name}},</p>
<p>Great news! Your application has been verified by our team.</p>
<p><strong>Application Details:</strong></p>
<ul>
<li>Application ID: {{application_id}}</li>
<li>Status: Verified</li>
<li>Updated On: {{updated_date}}</li>
</ul>
<p>Our team will proceed with the next steps. You will receive further updates via email.</p>
<p>Best regards,<br>Duke Consultancy Team</p>',
'{{candidate_name}}, {{application_id}}, {{updated_date}}',
'Sent when application status changes to verified'),

('status_approved', 'Application Approved - Congratulations!', 'Application Approved - Duke Consultancy',
'<p>Dear {{candidate_name}},</p>
<p>Congratulations! We are pleased to inform you that your application has been approved.</p>
<p><strong>Application Details:</strong></p>
<ul>
<li>Application ID: {{application_id}}</li>
<li>Status: Approved</li>
<li>Updated On: {{updated_date}}</li>
</ul>
<p>Our team will contact you soon with the next steps for your placement.</p>
<p>Best regards,<br>Duke Consultancy Team</p>',
'{{candidate_name}}, {{application_id}}, {{updated_date}}',
'Sent when application is approved'),

('status_rejected', 'Application Status Update', 'Application Status Update - Duke Consultancy',
'<p>Dear {{candidate_name}},</p>
<p>Thank you for your interest in Duke Consultancy.</p>
<p>After careful review, we regret to inform you that we are unable to proceed with your application at this time.</p>
<p><strong>Application Details:</strong></p>
<ul>
<li>Application ID: {{application_id}}</li>
<li>Status: Not Selected</li>
<li>Updated On: {{updated_date}}</li>
</ul>
{{#if remarks}}<p><strong>Additional Notes:</strong> {{remarks}}</p>{{/if}}
<p>We encourage you to apply again in the future when new opportunities arise.</p>
<p>Best regards,<br>Duke Consultancy Team</p>',
'{{candidate_name}}, {{application_id}}, {{updated_date}}, {{remarks}}',
'Sent when application is rejected'),

('password_reset', 'Password Reset Request', 'Reset Your Password - Duke Consultancy',
'<p>Dear {{user_name}},</p>
<p>We received a request to reset your password for your Duke Consultancy account.</p>
<p>Click the link below to reset your password:</p>
<p><a href="{{reset_link}}" style="background-color: #00A6CE; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn''t request a password reset, please ignore this email.</p>
<p>Best regards,<br>Duke Consultancy Team</p>',
'{{user_name}}, {{reset_link}}',
'Sent for password reset requests');
