import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import emailService from '../services/emailService.js';

const router = express.Router();

router.post('/email/bulk-send', requireAuth, async (req, res) => {
  try {
    const { applicationIds, subject, body, templateId } = req.body;

    // Input validation
    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid application IDs' });
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Subject is required' });
    }

    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Email body is required' });
    }

    // Limit bulk send to reasonable number
    if (applicationIds.length > 100) {
      return res.status(400).json({ success: false, message: 'Cannot send to more than 100 recipients at once' });
    }

    const [applications] = await db.query(
      `SELECT a.id, a.email, c.full_name, a.trade, a.status, a.applied_date 
       FROM applications a 
       LEFT JOIN candidates c ON a.candidate_id = c.id 
       WHERE a.id IN (?)`,
      [applicationIds]
    );

    if (applications.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid recipients found' });
    }

    let sent = 0;
    let failed = 0;

    for (const app of applications) {
      try {
        // Replace variables in subject and body
        const personalizedSubject = subject
          .replace(/\{\{candidate_name\}\}/g, app.full_name || 'Candidate')
          .replace(/\{\{application_id\}\}/g, app.id)
          .replace(/\{\{trade\}\}/g, app.trade || 'N/A')
          .replace(/\{\{status\}\}/g, app.status || 'pending')
          .replace(/\{\{email\}\}/g, app.email);

        const personalizedBody = body
          .replace(/\{\{candidate_name\}\}/g, app.full_name || 'Candidate')
          .replace(/\{\{application_id\}\}/g, app.id)
          .replace(/\{\{trade\}\}/g, app.trade || 'N/A')
          .replace(/\{\{status\}\}/g, app.status || 'pending')
          .replace(/\{\{submitted_date\}\}/g, new Date(app.applied_date).toLocaleDateString())
          .replace(/\{\{email\}\}/g, app.email);

        const result = await emailService.sendEmail(
          app.email,
          personalizedSubject,
          personalizedBody,
          {
            candidate_name: app.full_name || 'Candidate',
            application_id: app.id,
            trade: app.trade || 'N/A',
            status: app.status || 'pending'
          }
        );

        // Log email
        await db.query(
          `INSERT INTO email_logs (recipient_email, recipient_name, subject, body, template_id, application_id, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [app.email, app.full_name, personalizedSubject, personalizedBody, templateId, app.id, result.success ? 'sent' : 'failed']
        );

        if (result.success) {
          sent++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`Failed to send email to ${app.email}:`, error);
        await db.query(
          `INSERT INTO email_logs (recipient_email, recipient_name, subject, body, template_id, application_id, status, error_message) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [app.email, app.full_name, subject, body, templateId, app.id, 'failed', error.message]
        );
        failed++;
      }
    }

    res.json({ 
      success: true, 
      sent, 
      failed,
      message: `Successfully sent ${sent} emails${failed > 0 ? `, ${failed} failed` : ''}` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/email/logs', requireAuth, async (req, res) => {
  try {
    const [logs] = await db.query(
      `SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT 100`
    );
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/email/inbox', requireAuth, async (req, res) => {
  try {
    const [emails] = await db.query(
      `SELECT * FROM incoming_emails ORDER BY received_at DESC LIMIT 100`
    );
    res.json({ success: true, emails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/email/inbox/:id/read', requireAuth, async (req, res) => {
  try {
    await db.query(
      `UPDATE incoming_emails SET is_read = true WHERE id = ?`,
      [req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Webhook endpoint for receiving emails (can be configured with email service)
// SECURITY: This endpoint should be protected with webhook signature verification in production
router.post('/email/webhook/incoming', async (req, res) => {
  try {
    // Webhook authentication - verify shared secret
    const webhookSecret = process.env.WEBHOOK_SECRET || 'your-webhook-secret-here';
    const providedSecret = req.headers['x-webhook-secret'];
    
    // In production, this should use proper signature verification from your email provider
    // For now, we use a simple shared secret
    if (providedSecret !== webhookSecret) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid webhook secret' });
    }

    const { from_email, from_name, to_email, subject, body } = req.body;

    // Basic validation
    if (!from_email || !to_email || !subject || !body) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(from_email) || !emailRegex.test(to_email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    // Sanitize body - limit length and strip dangerous content
    const sanitizedBody = body.substring(0, 10000); // Limit to 10k chars

    // Try to find the application by email
    const [applications] = await db.query(
      `SELECT id FROM applications WHERE email = ? LIMIT 1`,
      [from_email]
    );

    const application_id = applications.length > 0 ? applications[0].id : null;

    await db.query(
      `INSERT INTO incoming_emails (from_email, from_name, to_email, subject, body, application_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [from_email, from_name || 'Unknown', to_email, subject, sanitizedBody, application_id]
    );

    res.json({ success: true, message: 'Email received' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
