import bcrypt from 'bcryptjs';
import pool from './db.js';

async function seedDatabase() {
  try {
    console.log('Seeding database...');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.query(`
      INSERT INTO admins (email, password, name)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING
    `, ['admin@duke.com', hashedPassword, 'Admin User']);
    
    console.log('✓ Default admin user created (email: admin@duke.com, password: admin123)');
    console.log('✓ Database seeding completed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
