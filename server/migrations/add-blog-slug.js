import db from '../db.js';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function addBlogSlug() {
  try {
    console.log('Adding slug column to blogs table...');
    
    // Add slug column if it doesn't exist
    await db.query(`
      ALTER TABLE blogs 
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE
    `);
    console.log('✓ Slug column added');
    
    // Get all existing blogs
    const [blogs] = await db.query('SELECT id, title FROM blogs');
    
    // Generate and update slugs for existing blogs
    for (const blog of blogs) {
      const slug = generateSlug(blog.title);
      await db.query('UPDATE blogs SET slug = ? WHERE id = ?', [slug, blog.id]);
    }
    console.log(`✓ Generated slugs for ${blogs.length} blogs`);
    
    console.log('✓ Blog slug migration complete');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✓ Slug column already exists');
      return;
    }
    console.error('Error adding blog slug:', error);
    throw error;
  }
}
