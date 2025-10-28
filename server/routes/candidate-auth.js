import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

router.post('/candidate/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    const [existing] = await db.query('SELECT id FROM candidates WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO candidates (email, password, status) VALUES (?, ?, ?)',
      [email, hashedPassword, 'approved']
    );

    const candidateId = result.insertId;

    await db.query(
      'INSERT INTO healthcare_profiles (candidate_id, first_name, last_name, mobile_no) VALUES (?, ?, ?, ?)',
      [candidateId, firstName, lastName, phone]
    );

    const token = jwt.sign({ id: candidateId, email, type: 'candidate' }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('candidate_token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, message: 'Registration successful', candidateId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/candidate/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [candidates] = await db.query('SELECT * FROM candidates WHERE email = ?', [email]);

    if (candidates.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const candidate = candidates[0];
    const isValidPassword = await bcrypt.compare(password, candidate.password);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Block login for pending or rejected candidates
    if (candidate.status === 'pending') {
      return res.status(403).json({ success: false, message: 'Your account is pending approval. Please contact support.' });
    }

    if (candidate.status === 'rejected') {
      return res.status(403).json({ success: false, message: 'Your account has been rejected. Please contact support for more information.' });
    }

    const token = jwt.sign({ id: candidate.id, email: candidate.email, type: 'candidate' }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('candidate_token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, message: 'Login successful', candidateId: candidate.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/candidate/verify', async (req, res) => {
  try {
    const token = req.cookies.candidate_token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const [candidates] = await db.query('SELECT id, email, status FROM candidates WHERE id = ?', [decoded.id]);

    if (candidates.length === 0) {
      return res.status(401).json({ success: false, message: 'Candidate not found' });
    }

    const [profiles] = await db.query('SELECT first_name, last_name FROM healthcare_profiles WHERE candidate_id = ?', [decoded.id]);

    res.json({
      success: true,
      candidate: {
        id: candidates[0].id,
        email: candidates[0].email,
        status: candidates[0].status,
        firstName: profiles[0]?.first_name,
        lastName: profiles[0]?.last_name
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

router.post('/candidate/logout', (req, res) => {
  res.clearCookie('candidate_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
