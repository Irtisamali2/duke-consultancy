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

router.get('/stats/recent-activity', requireAuth, async (req, res) => {
  try {
    const [recentApplications] = await db.query(`
      SELECT 
        a.id,
        a.applied_date,
        a.status,
        c.email,
        hp.first_name,
        hp.last_name,
        hp.trade_applied_for,
        j.title as job_title
      FROM applications a
      LEFT JOIN candidates c ON a.candidate_id = c.id
      LEFT JOIN healthcare_profiles hp ON a.id = hp.application_id
      LEFT JOIN jobs j ON a.job_id = j.id
      ORDER BY a.applied_date DESC
      LIMIT 10
    `);

    const [recentCandidates] = await db.query(`
      SELECT 
        c.id,
        c.email,
        c.created_at,
        COUNT(a.id) as application_count
      FROM candidates c
      LEFT JOIN applications a ON c.id = a.candidate_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT 5
    `);

    const [statusBreakdown] = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM applications
      GROUP BY status
    `);

    res.json({
      success: true,
      recentApplications,
      recentCandidates,
      statusBreakdown
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
