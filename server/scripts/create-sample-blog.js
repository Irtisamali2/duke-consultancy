import db from '../db.js';

async function createSampleBlog() {
  try {
    const title = "Diet Tips for a Healthier Lifestyle";
    const category = "Diet Tips";
    const author = "Duke Team";
    const tags = "health,diet,nutrition,lifestyle";
    const status = "published";
    const publishedDate = new Date("2024-04-28");
    const excerpt = "Maintaining a healthy diet is crucial for overall well-being and can prevent numerous health issues.";
    
    // Featured image - using a food/health related image
    const featuredImage = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800";
    
    // Rich HTML content matching Figma design
    const content = `
      <p>As more companies embrace remote work, virtual job interviews have become the norm. While they offer the convenience of interviewing from anywhere, they also come with unique challenges.</p>
      
      <div style="margin: 2rem 0;">
        <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800" alt="Professional meeting" style="width: 100%; border-radius: 12px;" />
      </div>
      
      <p>From mastering technology to ensuring a professional appearance on screen, it's important to prepare thoroughly to make a strong impression. In this guide, we walk you through the steps to ace your virtual job interview.</p>
      
      <h2>Prepare Your Technology</h2>
      <p>Prior to your virtual interview, ensure that all your technology is functioning properly. This includes your internet connection, webcam, microphone, and any software you'll be using. It's worth it to test your setup to avoid technical issues that can distract from your interview performance. Make sure the software is updated, your WiFi is stable, and that your surroundings are quiet to ensure clear communication.</p>
      
      <h3>Tips for success:</h3>
      <ul>
        <li>Test your tech: Check your internet connection and ensure your video and audio work seamlessly. Do a trial run with a friend or a family member.</li>
        <li>Use a headset: A headset can help minimize software (software) downloaded and are familiar with its functions.</li>
        <li>Have a backup plan: In case of technical issues (power cut or internet failure), have a phone or another device ready as a backup, ready to use or technical issues before they escalate.</li>
        <li>Backup plan: Keep a backup device, such as a phone or tablet, ready in case of technical issues before they escalate.</li>
      </ul>
      
      <h2>Set Up a Professional Environment</h2>
      <p>Your surroundings play a crucial role in a virtual interview. It's essential to choose a distraction-free background that appears professional. Ideally, set up in a quiet, well-lit area where you won't be interrupted. Pay close attention to your lighting - natural light works best, but if that's not possible, consider using a simple, unobtrusive background. If you're using a virtual background, ensure it looks professional and isn't too busy. Avoid any distracting elements such as personal items, bright colors, or anything that might draw attention away from you during the interview.</p>
      
      <ul>
        <li>Neutral background: Use a tidy, neutral background. If this isn't possible, consider a blurred background.</li>
        <li>Good lighting: Position yourself facing a light source (e.g., a window) to ensure you're well-lit. Avoid backlighting.</li>
        <li>Camera setup: Position your camera at eye level to maintain eye contact. Prop up your laptop or use a stand if necessary.</li>
        <li>Minimize distractions: Inform household members about your interview. Put your phone on silent, and close any unnecessary tabs or applications.</li>
      </ul>
      
      <div style="margin: 2rem 0;">
        <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800" alt="Professional handshake" style="width: 100%; border-radius: 12px;" />
      </div>
      
      <h2>Research the Company and Role</h2>
      <p>Strong preparation is essential to succeed in any interview. Research the company, its culture, and the role you're interviewing for. This knowledge will help you ask insightful questions and show that you're eager to join their team. Look into current projects and recent news to showcase your interest.</p>
    `;

    // First, check if an admin exists to use as created_by
    const [admins] = await db.query('SELECT id FROM admins LIMIT 1');
    const createdBy = admins.length > 0 ? admins[0].id : 1;

    const [result] = await db.query(
      `INSERT INTO blogs (title, content, excerpt, featured_image, author, category, tags, status, created_by, published_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, content, excerpt, featuredImage, author, category, tags, status, createdBy, publishedDate]
    );

    console.log(`✓ Sample blog created successfully with ID: ${result.insertId}`);
    console.log(`  Title: ${title}`);
    console.log(`  Category: ${category}`);
    console.log(`  Status: ${status}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Failed to create sample blog:', error);
    process.exit(1);
  }
}

createSampleBlog();
