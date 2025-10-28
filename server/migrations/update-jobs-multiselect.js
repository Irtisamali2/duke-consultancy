import db from '../db.js';

export async function updateJobsForMultiselect() {
  try {
    console.log('Updating jobs table for multi-select support...');
    
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'jobs' 
      AND TABLE_SCHEMA = DATABASE()
    `);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    
    if (!columnNames.includes('countries')) {
      await db.query(`
        ALTER TABLE jobs 
        ADD COLUMN countries JSON DEFAULT NULL COMMENT 'Array of countries for this job'
      `);
      console.log('✓ Added countries column to jobs table');
    }
    
    if (!columnNames.includes('trades')) {
      await db.query(`
        ALTER TABLE jobs 
        ADD COLUMN trades JSON DEFAULT NULL COMMENT 'Array of trades/specializations for this job'
      `);
      console.log('✓ Added trades column to jobs table');
    }
    
    if (!columnNames.includes('max_countries_selectable')) {
      await db.query(`
        ALTER TABLE jobs 
        ADD COLUMN max_countries_selectable INT DEFAULT 1 COMMENT 'Maximum countries candidate can select'
      `);
      console.log('✓ Added max_countries_selectable column to jobs table');
    }
    
    if (!columnNames.includes('max_trades_selectable')) {
      await db.query(`
        ALTER TABLE jobs 
        ADD COLUMN max_trades_selectable INT DEFAULT 1 COMMENT 'Maximum trades candidate can select'
      `);
      console.log('✓ Added max_trades_selectable column to jobs table');
    }
    
    await db.query(`
      UPDATE jobs 
      SET countries = JSON_ARRAY(country),
          trades = JSON_ARRAY(specialization)
      WHERE countries IS NULL OR trades IS NULL
    `);
    console.log('✓ Migrated existing job data to new format');
    
    console.log('✓ Jobs table multi-select migration complete');
  } catch (error) {
    console.error('Error updating jobs table:', error);
  }
}
