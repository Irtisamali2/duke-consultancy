import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/email/smtp-settings', requireAuth, async (req, res) => {
  try {
    const [settings] = await db.query(
      'SELECT id, smtp_host, smtp_port, smtp_secure, smtp_user, from_email, from_name, is_active FROM smtp_settings ORDER BY id DESC LIMIT 1'
    );
    res.json({ success: true, settings: settings[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/email/smtp-settings', requireAuth, async (req, res) => {
  try {
    const { smtp_host, smtp_port, smtp_secure, smtp_user, smtp_password, from_email, from_name } = req.body;

    await db.query('UPDATE smtp_settings SET is_active = false');

    await db.query(
      'INSERT INTO smtp_settings (smtp_host, smtp_port, smtp_secure, smtp_user, smtp_password, from_email, from_name, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, true)',
      [smtp_host, smtp_port, smtp_secure ? 1 : 0, smtp_user, smtp_password, from_email, from_name]
    );

    res.json({ success: true, message: 'SMTP settings saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/email/templates', requireAuth, async (req, res) => {
  try {
    const [templates] = await db.query('SELECT * FROM email_templates ORDER BY template_name');
    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/email/templates', requireAuth, async (req, res) => {
  try {
    const { template_name, status_type, subject, body, description } = req.body;
    
    const template_key = status_type;
    const variables = '{{candidate_name}}, {{application_id}}, {{trade}}, {{submitted_date}}, {{updated_date}}, {{remarks}}, {{reset_link}}';

    await db.query(
      'INSERT INTO email_templates (template_key, template_name, subject, body, variables, description) VALUES (?, ?, ?, ?, ?, ?)',
      [template_key, template_name, subject, body, variables, description]
    );

    res.json({ success: true, message: 'Template created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/email/templates/:id', requireAuth, async (req, res) => {
  try {
    const [templates] = await db.query('SELECT * FROM email_templates WHERE id = ?', [req.params.id]);
    if (templates.length === 0) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, template: templates[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/email/templates/:id', requireAuth, async (req, res) => {
  try {
    const { subject, body } = req.body;
    await db.query(
      'UPDATE email_templates SET subject = ?, body = ? WHERE id = ?',
      [subject, body, req.params.id]
    );
    res.json({ success: true, message: 'Template updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
