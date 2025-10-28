import nodemailer from 'nodemailer';
import db from '../db.js';

class EmailService {
  constructor() {
    this.transporter = null;
  }

  async initializeTransporter() {
    try {
      const [settings] = await db.query(
        'SELECT * FROM smtp_settings WHERE is_active = true ORDER BY id DESC LIMIT 1'
      );

      if (settings.length === 0) {
        console.log('No active SMTP settings found');
        return false;
      }

      const config = settings[0];
      this.transporter = nodemailer.createTransport({
        host: config.smtp_host,
        port: config.smtp_port,
        secure: config.smtp_secure,
        auth: {
          user: config.smtp_user,
          pass: config.smtp_password
        }
      });

      this.fromEmail = config.from_email;
      this.fromName = config.from_name;

      return true;
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
      return false;
    }
  }

  async getTemplate(templateKey) {
    try {
      const [templates] = await db.query(
        'SELECT * FROM email_templates WHERE template_key = ?',
        [templateKey]
      );

      if (templates.length === 0) {
        throw new Error(`Template ${templateKey} not found`);
      }

      return templates[0];
    } catch (error) {
      throw error;
    }
  }

  replaceVariables(text, variables) {
    let result = text;
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, variables[key] || '');
    });
    
    result = result.replace(/{{#if\s+(\w+)}}(.*?){{\/if}}/gs, (match, varName, content) => {
      return variables[varName] ? content : '';
    });
    
    return result;
  }

  async sendEmail(to, templateKey, variables) {
    try {
      if (!this.transporter) {
        const initialized = await this.initializeTransporter();
        if (!initialized) {
          console.error('Email service not configured');
          return { success: false, message: 'Email service not configured' };
        }
      }

      const template = await this.getTemplate(templateKey);
      const subject = this.replaceVariables(template.subject, variables);
      const html = this.replaceVariables(template.body, variables);

      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to,
        subject,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, message: error.message };
    }
  }

  async sendApplicationReceivedEmail(candidateEmail, data) {
    return await this.sendEmail(candidateEmail, 'application_received', data);
  }

  async sendStatusChangeEmail(candidateEmail, status, data) {
    const templateMap = {
      'verified': 'status_verified',
      'approved': 'status_approved',
      'rejected': 'status_rejected'
    };

    const templateKey = templateMap[status];
    if (!templateKey) {
      console.log(`No email template for status: ${status}`);
      return { success: false, message: 'No template for status' };
    }

    return await this.sendEmail(candidateEmail, templateKey, data);
  }

  async sendPasswordResetEmail(email, data) {
    return await this.sendEmail(email, 'password_reset', data);
  }
}

export default new EmailService();
