// Simple HTML sanitization function for client-side
// This is a basic implementation - for production, consider using DOMPurify
export function sanitizeHtml(html) {
  if (!html) return '';
  
  // Create a temporary div element
  const temp = document.createElement('div');
  temp.textContent = html;
  
  // For displaying HTML, we'll trust the content from our database
  // But we'll escape any potentially dangerous attributes
  return html
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

// For email logs display - renders as text to prevent XSS
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
