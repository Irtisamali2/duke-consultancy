# Email System Documentation

## Features Implemented

### 1. WYSIWYG Email Editor
- React-Quill rich text editor with full formatting support
- Image insertion capability
- Shortcode insertion buttons for all candidate fields
- Available shortcodes:
  - `{{candidate_name}}` - Candidate's full name
  - `{{email}}` - Email address
  - `{{phone}}` - Phone number
  - `{{application_id}}` - Application ID
  - `{{trade}}` - Trade/profession
  - `{{submitted_date}}` - Submission date
  - `{{updated_date}}` - Update date
  - `{{status}}` - Application status
  - `{{remarks}}` - Admin remarks
  - `{{reset_link}}` - Password reset link
  - And more...

### 2. Email Templates
- Create, view, edit email templates
- Template types: Application Received, Verified, Approved, Rejected, Reminder, Password Reset, Custom
- Demo templates automatically created in database

### 3. Bulk Email System
- Select multiple candidates using checkboxes in Applications Management
- Send bulk emails with template selection or custom composition
- Rate limiting: Maximum 100 recipients per bulk send
- Email logging for all sent emails

### 4. Email Logs
- Track all sent emails with status (sent/failed/pending)
- View complete email history
- Search and filter capabilities
- XSS-safe email body preview

### 5. Email Inbox
- Receive and manage incoming emails from candidates
- Mark emails as read/unread
- Reply via email client integration
- XSS-safe message display

## Security Measures

### XSS Protection
- All email content displayed using `textContent` (not `innerHTML`)
- DOM elements created programmatically to prevent injection
- Email bodies rendered as plain text in logs and inbox

### Input Validation
- Bulk email: Type checking, array validation, required fields
- Webhook: Email format validation, required fields check
- Body length limits (10k characters for incoming emails)

### Webhook Authentication
⚠️ **IMPORTANT**: Set a strong webhook secret in production!

Set environment variable:
```
WEBHOOK_SECRET=your-secure-random-secret-here
```

The webhook endpoint expects this secret in the `X-Webhook-Secret` header.

**Production Recommendations:**
1. Use a cryptographically secure random string (32+ characters)
2. Consider implementing provider-specific signature verification (e.g., SendGrid, Mailgun signatures)
3. Add rate limiting to prevent DoS attacks
4. Monitor webhook logs for suspicious activity

## Database Tables

### email_templates
- Stores all email templates
- Fields: id, template_key, template_name, subject, body, variables, description

### email_logs
- Tracks all sent emails
- Fields: id, recipient_email, recipient_name, subject, body, template_id, application_id, status, error_message, sent_at

### incoming_emails
- Stores received emails
- Fields: id, from_email, from_name, to_email, subject, body, is_read, application_id, received_at

### smtp_settings
- SMTP configuration for sending emails
- Fields: id, smtp_host, smtp_port, smtp_secure, smtp_user, smtp_password, from_email, from_name, is_active

## API Endpoints

### Email Templates
- `GET /api/email/templates` - List all templates
- `GET /api/email/templates/:id` - Get specific template
- `POST /api/email/templates` - Create new template
- `PUT /api/email/templates/:id` - Update template

### Bulk Email
- `POST /api/email/bulk-send` - Send bulk emails (requires auth)

### Email Logs
- `GET /api/email/logs` - View email logs (requires auth)

### Email Inbox
- `GET /api/email/inbox` - View incoming emails (requires auth)
- `PATCH /api/email/inbox/:id/read` - Mark email as read (requires auth)
- `POST /api/email/webhook/incoming` - Webhook for receiving emails (requires X-Webhook-Secret header)

## Future Improvements

1. **Server-side HTML Sanitization**: Use DOMPurify to sanitize HTML before storage
2. **Enhanced Webhook Security**: Implement provider-specific signature verification
3. **Rate Limiting**: Add request rate limiting to all email endpoints
4. **Template Variable Encoding**: Encode candidate-provided fields before substitution
5. **Email Analytics**: Track open rates, click rates, bounce rates
6. **Scheduled Emails**: Queue emails for future sending
7. **Email Attachments**: Support file attachments in emails

## Configuration

### SMTP Settings (Admin Panel)
1. Navigate to Admin → Email Settings
2. Configure your cPanel SMTP settings:
   - SMTP Host (e.g., mail.yourdomain.com)
   - SMTP Port (usually 465 for SSL or 587 for TLS)
   - SMTP User (your email address)
   - SMTP Password
   - From Email
   - From Name
3. Click "Save Settings"

### Webhook Configuration
To receive incoming emails:
1. Set `WEBHOOK_SECRET` environment variable
2. Configure your email provider to forward incoming emails to:
   `POST https://yourdomain.com/api/email/webhook/incoming`
3. Include `X-Webhook-Secret` header with your secret

## Usage

### Sending Bulk Emails
1. Go to Admin → Applications Management
2. Use checkboxes to select candidates
3. Click "Send Bulk Email"
4. Choose a template or compose custom email
5. Click "Send to X Recipients"

### Creating Email Templates
1. Go to Admin → Email Templates
2. Click "+ Create New Template"
3. Enter template name, select status type
4. Use the WYSIWYG editor to compose your email
5. Click "Insert Shortcode" to add dynamic fields
6. Save template

### Viewing Email Logs
1. Go to Admin → Email Logs
2. View all sent emails with status
3. Click "View Details" to see full email content

### Managing Inbox
1. Go to Admin → Email Inbox
2. View all incoming emails
3. Click "View" to read email
4. Click "Reply via Email Client" to respond
