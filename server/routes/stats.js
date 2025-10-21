import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', requireAuth, async (req, res) => {
  try {
    const [applications] = await db.query('SELECT COUNT(*) as count FROM applications');
    const [jobs] = await db.query('SELECT COUNT(*) as count FROM jobs WHERE status = "active"');
    const [profiles] = await db.query('SELECT COUNT(*) as count FROM candidates');
    const [blogs] = await db.query('SELECT COUNT(*) as count FROM blogs WHERE status = "published"');

    res.json({
      success: true,
      stats: {
        totalApplications: applications[0].count,
        activeJobs: jobs[0].count,
        healthcareProfiles: profiles[0].count,
        publishedBlogs: blogs[0].count
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
