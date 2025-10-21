import express from 'express';
import fs from 'fs';
import path from 'path';
import db from '../db.js';

const router = express.Router();

router.post('/run-migration', async (req, res) => {
  try {
    const migrationPath = path.resolve(import.meta.dirname, '..', 'migrations', '001_create_tables.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      await db.query(statement);
    }
    
    res.json({ 
      success: true, 
      message: 'Database tables created successfully',
      statements: statements.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Migration failed',
      error: error.message 
    });
  }
});

export default router;
