import pool from './db.js';

async function checkAllApplications() {
  try {
    console.log('\n=== All Applications ===\n');
    
    const [apps] = await pool.query(`
      SELECT 
        a.id, 
        a.candidate_id, 
        a.job_id, 
        a.status, 
        a.applied_date,
        c.email,
        j.title as job_title
      FROM applications a
      LEFT JOIN candidates c ON a.candidate_id = c.id
      LEFT JOIN jobs j ON a.job_id = j.id
      ORDER BY a.candidate_id, a.job_id, a.id
    `);
    
    console.log(`Total applications: ${apps.length}\n`);
    
    // Group by candidate and job to find duplicates
    const grouped = {};
    apps.forEach(app => {
      const key = `${app.candidate_id}-${app.job_id}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(app);
    });
    
    // Display all applications
    apps.forEach(app => {
      console.log(`ID: ${app.id} | Candidate: ${app.email} | Job: ${app.job_title} | Status: ${app.status} | Date: ${app.applied_date}`);
    });
    
    console.log('\n=== Duplicates ===\n');
    let hasDuplicates = false;
    Object.entries(grouped).forEach(([key, appList]) => {
      if (appList.length > 1) {
        hasDuplicates = true;
        console.log(`Candidate ${appList[0].email} has ${appList.length} applications for job "${appList[0].job_title}":`);
        appList.forEach(app => {
          console.log(`  - ID: ${app.id}, Status: ${app.status}, Date: ${app.applied_date}`);
        });
        console.log('');
      }
    });
    
    if (!hasDuplicates) {
      console.log('No duplicates found!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAllApplications();
