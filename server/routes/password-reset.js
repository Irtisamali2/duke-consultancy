import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import emailService from '../services/emailService.js';

const router = express.Router();

router.post('/forgot-password/candidate', async (req, res) => {
  try {
    const { email } = req.body;

    const [candidates] = await db.query('SELECT id, email FROM candidates WHERE email = ?', [email]);
    
    if (candidates.length === 0) {
      return res.status(404).json({ success: false, message: 'No user exists with this email address' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000);
    const candidateId = candidates[0].id;

    await db.query(
      'INSERT INTO password_reset_tokens (user_id, email, token, user_type, expires_at) VALUES (?, ?, ?, ?, ?)',
      [candidateId, email, token, 'candidate', expiresAt]
    );

    const resetLink = `${process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000'}/candidate/reset-password?token=${token}`;

    await emailService.sendPasswordResetEmail(email, {
      user_name: email,
      reset_link: resetLink
    });

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ success: false, message: 'Failed to process request' });
  }
});

router.post('/forgot-password/admin', async (req, res) => {
  try {
    const { email } = req.body;

    const [admins] = await db.query('SELECT id, email, name FROM admins WHERE email = ?', [email]);
    
    if (admins.length === 0) {
      return res.json({ success: true, message: 'If an account exists, you will receive a password reset email' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000);
    const adminId = admins[0].id;

    await db.query(
      'INSERT INTO password_reset_tokens (user_id, email, token, user_type, expires_at) VALUES (?, ?, ?, ?, ?)',
      [adminId, email, token, 'admin', expiresAt]
    );

    const resetLink = `${process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000'}/admin/reset-password?token=${token}`;

    await emailService.sendPasswordResetEmail(email, {
      user_name: admins[0].name,
      reset_link: resetLink
    });

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ success: false, message: 'Failed to process request' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, userType } = req.body;

    const [tokens] = await db.query(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND user_type = ? AND used = false AND expires_at > NOW()',
      [token, userType]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    const resetToken = tokens[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    if (userType === 'admin') {
      await db.query('UPDATE admins SET password = ? WHERE email = ?', [hashedPassword, resetToken.email]);
    } else {
      await db.query('UPDATE candidates SET password = ? WHERE email = ?', [hashedPassword, resetToken.email]);
    }

    await db.query('UPDATE password_reset_tokens SET used = true WHERE id = ?', [resetToken.id]);

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
});

router.get('/verify-reset-token', async (req, res) => {
  try {
    const { token, userType } = req.query;

    const [tokens] = await db.query(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND user_type = ? AND used = false AND expires_at > NOW()',
      [token, userType]
    );

    if (tokens.length === 0) {
      return res.json({ success: false, message: 'Invalid or expired token' });
    }

    res.json({ success: true, email: tokens[0].email });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify token' });
  }
});

export default router;
