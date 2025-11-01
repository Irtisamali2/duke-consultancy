# Deploy Duke Consultancy to cPanel Hosting

This guide explains how to deploy your Duke Consultancy MERN application to cPanel hosting.

## Prerequisites

- cPanel hosting with Node.js support (most modern cPanel hosts support this)
- SSH access to your hosting account
- Your domain configured in cPanel
- MySQL database already set up at 51.68.193.188

## Important Note

Your application uses:
- **Database**: MySQL at 51.68.193.188 (already configured)
- **Backend**: Node.js/Express server
- **Frontend**: React (served as static files)

## Step 1: Prepare Your cPanel Account

### 1.1 Enable Node.js Application

1. Log into cPanel
2. Look for "Setup Node.js App" or "Node.js Selector" in the "Software" section
3. If you don't see this, contact your hosting provider to enable Node.js

### 1.2 Create Application Directory

1. In cPanel, go to "File Manager"
2. Navigate to your public_html or create a subdirectory
3. Common structure:
   - `public_html/` - for your domain root
   - `public_html/yourdomain.com/` - for specific domain

## Step 2: Upload Your Application Files

### Option A: Using Git (Recommended)

1. **Enable SSH Access** in cPanel
2. **Connect via SSH**:
   ```bash
   ssh username@yourdomain.com
   ```

3. **Navigate to your web directory**:
   ```bash
   cd public_html
   ```

4. **Clone your repository** (or upload your files):
   ```bash
   git clone your-repository-url duke-consultancy
   cd duke-consultancy
   ```

### Option B: Using File Manager/FTP

1. Zip your entire project locally
2. Upload the zip file via cPanel File Manager
3. Extract it in your web directory

## Step 3: Configure Node.js Application

### 3.1 Setup Node.js in cPanel

1. Go to "Setup Node.js App"
2. Click "Create Application"
3. Configure:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: Select your application directory (e.g., `/home/username/public_html/duke-consultancy`)
   - **Application URL**: Your domain or subdomain
   - **Application startup file**: `server/index.js`
   - **Passenger log file**: Leave default

4. Click "Create"

### 3.2 Install Dependencies

1. In the Node.js App interface, you'll see a command to run
2. Or via SSH:
   ```bash
   cd /home/username/public_html/duke-consultancy
   npm install
   ```

## Step 4: Configure Environment Variables

### 4.1 Create .env File

1. In cPanel File Manager or via SSH, create a `.env` file in your project root
2. Add the following configuration:

```env
# Database Configuration (Your existing MySQL database)
DB_HOST=51.68.193.188
DB_USER=hazzains_duke_admin
DB_PASSWORD=your-database-password
DB_NAME=hazzains_duke_admin
DB_PORT=3306

# Server Configuration
NODE_ENV=production
PORT=3000

# Session Secret (generate a random string)
SESSION_SECRET=your-random-session-secret-here

# Email Configuration (for sending emails via cPanel)
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=admin@yourdomain.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=admin@yourdomain.com

# Webhook Secret (for Email Inbox)
WEBHOOK_SECRET=your-webhook-secret-here

# Domain Configuration
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com
```

### 4.2 Set Environment Variables in cPanel (Alternative)

1. In "Setup Node.js App", scroll to "Environment Variables"
2. Add each variable from above:
   - Click "Add Variable"
   - Enter name and value
   - Click "Save"

## Step 5: Build Frontend

Your React frontend needs to be built for production:

```bash
cd /home/username/public_html/duke-consultancy
npm run build
```

This creates optimized production files in the `dist` folder.

## Step 6: Configure Server to Serve Frontend

Your `server/index.js` should already be configured to serve the frontend. Verify it has:

```javascript
// Serve static files from React build
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});
```

## Step 7: Configure Domain

### 7.1 Point Domain to Application

1. **In cPanel > Domains**, verify your domain is set up
2. **In cPanel > Setup Node.js App**, ensure your app is mapped to the domain

### 7.2 Setup .htaccess (if needed)

Create/edit `.htaccess` in your application root:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy to Node.js app (if using Apache)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

## Step 8: Start the Application

### Via cPanel Interface

1. Go to "Setup Node.js App"
2. Find your application
3. Click "Start" or "Restart"
4. Status should show "Running"

### Via SSH

```bash
cd /home/username/public_html/duke-consultancy
node server/index.js
```

Or use PM2 for process management:

```bash
npm install -g pm2
pm2 start server/index.js --name duke-consultancy
pm2 save
pm2 startup
```

## Step 9: SSL Certificate

1. In cPanel, go to "SSL/TLS Status"
2. Enable "AutoSSL" or install Let's Encrypt certificate
3. Your application will be accessible via HTTPS

## Step 10: Email Configuration for cPanel

### 10.1 Get Email Credentials

1. In cPanel > Email Accounts
2. Note your email settings:
   - Incoming Server: mail.yourdomain.com
   - Outgoing Server: mail.yourdomain.com
   - Username: your-email@yourdomain.com
   - Password: your email password
   - SMTP Port: 587 (or 465 for SSL)

### 10.2 Update .env File

Update these in your `.env`:

```env
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_USER=admin@yourdomain.com
EMAIL_PASSWORD=your-cpanel-email-password
EMAIL_FROM=admin@yourdomain.com
```

## Troubleshooting

### Application Won't Start

1. Check Node.js version compatibility (use 18.x or higher)
2. Verify all dependencies are installed
3. Check application logs in cPanel
4. Ensure port 3000 is available

### Database Connection Issues

1. Verify database credentials in `.env`
2. Check if your hosting IP is whitelisted in the database firewall
3. Test connection from SSH:
   ```bash
   mysql -h 51.68.193.188 -u hazzains_duke_admin -p
   ```

### Email Not Sending

1. Verify cPanel email account exists
2. Check SMTP credentials in `.env`
3. Some hosts block port 25, use port 587 or 465
4. Check if your hosting provider requires email authentication

### Frontend Not Loading

1. Ensure `npm run build` completed successfully
2. Check that `dist` folder exists and contains files
3. Verify server is serving static files correctly

## Performance Optimization

### Enable Gzip Compression

Add to your Express server (already configured):

```javascript
app.use(compression());
```

### Use PM2 for Process Management

```bash
pm2 start server/index.js --name duke-consultancy -i max
pm2 save
```

### Enable Caching

Configure in `.htaccess`:

```apache
# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## Accessing Your Application

Once deployed, access your application at:
- **Frontend**: https://yourdomain.com
- **Admin Panel**: https://yourdomain.com/admin
- **API**: https://yourdomain.com/api

## Updating Your Application

To update after making changes:

```bash
# Via SSH
cd /home/username/public_html/duke-consultancy
git pull origin main  # if using git
npm install  # if package.json changed
npm run build  # rebuild frontend
pm2 restart duke-consultancy  # or use cPanel restart
```

## Important Files Summary

- **`.env`** - Environment variables and configuration
- **`server/index.js`** - Application entry point
- **`dist/`** - Built frontend files (generated by `npm run build`)
- **`.htaccess`** - Apache configuration (if applicable)
