import db from '../db.js';

export async function updateProfilesForMultiselect() {
  try {
    console.log('Updating healthcare_profiles table for multi-select support...');
    
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'healthcare_profiles' 
      AND TABLE_SCHEMA = DATABASE()
    `);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    
    if (!columnNames.includes('countries_preference')) {
      await db.query(`
        ALTER TABLE healthcare_profiles 
        ADD COLUMN countries_preference JSON DEFAULT NULL COMMENT 'Array of preferred countries in order'
      `);
      console.log('✓ Added countries_preference column to healthcare_profiles table');
    }
    
    if (!columnNames.includes('trades_preference')) {
      await db.query(`
        ALTER TABLE healthcare_profiles 
        ADD COLUMN trades_preference JSON DEFAULT NULL COMMENT 'Array of preferred trades'
      `);
      console.log('✓ Added trades_preference column to healthcare_profiles table');
    }
    
    await db.query(`
      UPDATE healthcare_profiles 
      SET countries_preference = JSON_ARRAY(country),
          trades_preference = JSON_ARRAY(trade_applied_for)
      WHERE (countries_preference IS NULL OR trades_preference IS NULL)
        AND country IS NOT NULL 
        AND trade_applied_for IS NOT NULL
    `);
    console.log('✓ Migrated existing profile data to new format');
    
    console.log('✓ Healthcare profiles multi-select migration complete');
  } catch (error) {
    console.error('Error updating healthcare_profiles table:', error);
  }
}
