import db from '../db.js';

export async function fixCandidateStatusEnum() {
  try {
    console.log('Fixing candidate status ENUM...');
    
    // First, update any 'verified' status to 'approved'
    await db.query(
      "UPDATE candidates SET status = 'approved' WHERE status = 'verified'"
    );
    console.log('✓ Migrated existing status data');
    
    // Modify the ENUM to include 'approved' instead of 'verified'
    await db.query(
      "ALTER TABLE candidates MODIFY COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved'"
    );
    console.log('✓ Updated status ENUM values');
    
    console.log('✓ Candidate status ENUM fix complete');
  } catch (error) {
    // If column doesn't exist or already has correct values, that's fine
    if (error.code === 'ER_BAD_FIELD_ERROR' || error.code === 'ER_DUP_FIELDNAME') {
      console.log('✓ Status ENUM already correct or not applicable');
      return;
    }
    console.error('Error fixing candidate status ENUM:', error);
    throw error;
  }
}
