import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';

const router = express.Router();

router.post('/fix-admin-password', async (req, res) => {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    
    await db.query(
      'UPDATE admins SET password = ? WHERE email = ?',
      [hash, 'admin@duke.com']
    );
    
    res.json({ 
      success: true, 
      message: 'Admin password updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update password',
      error: error.message 
    });
  }
});

export default router;
