-- Add excerpt and featured_image columns to blogs table if they don't exist

ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS excerpt TEXT AFTER content,
ADD COLUMN IF NOT EXISTS featured_image VARCHAR(500) AFTER excerpt;
