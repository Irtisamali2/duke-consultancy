# Duke Consultancy Configuration Guide

This guide shows you exactly where to configure domain and database settings for your Duke Consultancy application.

## Quick Start: Configuration Checklist

- [ ] Create `.env` file from `.env.example`
- [ ] Configure database credentials
- [ ] Set domain URLs
- [ ] Generate security secrets
- [ ] Configure email settings (optional - can do in Admin Panel)
- [ ] Set webhook secret for Email Inbox

---

## 1. Database Configuration

### Location: `.env` file (root directory)

Your application uses **MySQL database at 51.68.193.188**. Configure database connection in the `.env` file:

```env
DB_HOST=51.68.193.188
DB_USER=hazzains_duke_admin
DB_PASSWORD=YOUR_ACTUAL_DATABASE_PASSWORD
DB_NAME=hazzains_duke_admin
DB_PORT=3306
```

### How it works:

- **File**: `server/db.js` reads these environment variables
- The database connection pool is created automatically
- No code changes needed - just update `.env` file

### Steps to Configure:

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** and replace:
   - `your-database-password-here` with your actual database password
   - Keep other DB settings as shown (host, user, database name)

3. **Save the file**

4. **Restart your application** for changes to take effect

---

## 2. Domain Configuration

### Location: `.env` file (root directory)

Configure your domain URLs for production deployment:

```env
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com
```

### Replace `yourdomain.com` with:

- **For cPanel hosting**: Your actual domain (e.g., `https://dukeconsultancy.com`)
- **For Replit**: Your Replit app URL (e.g., `https://duke-consultancy.your-username.replit.app`)
- **For development**: `http://localhost:5000`

### Why this matters:

- Used in email links (e.g., "View Application" links sent to candidates)
- Used for CORS configuration
- Used in webhook URLs
- Used for redirect URLs after login/signup

### Example configurations:

**Production (cPanel)**:
```env
FRONTEND_URL=https://dukeconsultancy.com
BACKEND_URL=https://dukeconsultancy.com
```

**Development (Replit)**:
```env
FRONTEND_URL=https://duke-consultancy.your-username.replit.app
BACKEND_URL=https://duke-consultancy.your-username.replit.app
```

**Local Development**:
```env
FRONTEND_URL=http://localhost:5000
BACKEND_URL=http://localhost:5000
```

---

## 3. Security Configuration

### Location: `.env` file (root directory)

Generate secure random secrets for:

#### Session Secret

```env
SESSION_SECRET=your-random-session-secret-here
```

**Generate using**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This protects user sessions and login cookies.

#### Webhook Secret

```env
WEBHOOK_SECRET=your-webhook-secret-here
```

**Generate using**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This authenticates webhook requests for the Email Inbox feature.

---

## 4. Email Configuration

### Option A: Configure in Admin Panel (Recommended)

1. **Login to Admin Panel**: `https://yourdomain.com/admin`
2. **Navigate to**: Email Settings
3. **Add SMTP Settings**:
   - SMTP Host: `mail.yourdomain.com`
   - SMTP Port: `587` (or `465` for SSL)
   - SMTP User: `admin@yourdomain.com`
   - SMTP Password: Your cPanel email password
   - From Email: `admin@yourdomain.com`
   - From Name: `Duke Consultancy`
   - Enable SSL: Check if using port 465

4. **Test the settings** using the "Send Test Email" button

### Option B: Configure in .env file (Fallback)

```env
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=admin@yourdomain.com
EMAIL_PASSWORD=your-email-password-here
EMAIL_FROM=admin@yourdomain.com
```

**Note**: Admin Panel settings take priority over `.env` file settings.

---

## 5. Server Configuration

### Location: `.env` file (root directory)

```env
NODE_ENV=production
PORT=5000
```

### Port Configuration:

- **Replit**: Must use `5000` (only port not firewalled)
- **cPanel**: Usually `3000` or auto-assigned by hosting
- **Local**: Any port (e.g., `3000`, `5000`, `8080`)

### Environment:

- `development` - Enables hot reload, detailed errors
- `production` - Optimized for performance, security

---

## 6. Complete .env File Example

Here's a complete `.env` file with all settings:

```env
# Database
DB_HOST=51.68.193.188
DB_USER=hazzains_duke_admin
DB_PASSWORD=MySecurePass123!
DB_NAME=hazzains_duke_admin
DB_PORT=3306

# Server
NODE_ENV=production
PORT=5000
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Domain
FRONTEND_URL=https://dukeconsultancy.com
BACKEND_URL=https://dukeconsultancy.com

# Email (optional - can configure in Admin Panel)
EMAIL_HOST=mail.dukeconsultancy.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=admin@dukeconsultancy.com
EMAIL_PASSWORD=EmailPass123!
EMAIL_FROM=admin@dukeconsultancy.com

# Webhook
WEBHOOK_SECRET=9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g9f8e7d6c5b4a3
```

---

## 7. Files You Need to Configure

| File | Purpose | Required? |
|------|---------|-----------|
| `.env` | Environment variables and configuration | ✅ Yes |
| `.htaccess` | Apache config (cPanel only) | For cPanel |
| `package.json` | Already configured | No changes needed |
| `server/db.js` | Database connection | No changes needed |
| `server/index.js` | Server entry point | No changes needed |

---

## 8. After Configuration Checklist

After setting up your `.env` file:

1. **Verify database connection**:
   ```bash
   # Try connecting to database
   mysql -h 51.68.193.188 -u hazzains_duke_admin -p
   ```

2. **Build frontend** (for production):
   ```bash
   npm run build
   ```

3. **Start the application**:
   ```bash
   npm start
   # or
   node server/index.js
   ```

4. **Test the application**:
   - Visit: `https://yourdomain.com`
   - Login to admin: `https://yourdomain.com/admin`
   - Test email sending
   - Submit a test application

5. **Check Email Settings** in Admin Panel:
   - Navigate to Email Settings
   - Configure SMTP settings
   - Send a test email

---

## 9. Troubleshooting

### Database won't connect?

1. Check credentials in `.env` file
2. Verify database server is accessible:
   ```bash
   ping 51.68.193.188
   telnet 51.68.193.188 3306
   ```
3. Check if your server IP is whitelisted in database firewall
4. Verify database user has proper permissions

### Domain not working?

1. Check `FRONTEND_URL` and `BACKEND_URL` in `.env`
2. Ensure no trailing slashes (use `https://domain.com` not `https://domain.com/`)
3. Use full URL with protocol (`https://` not just `domain.com`)
4. Restart application after changing `.env`

### Emails not sending?

1. Configure SMTP settings in Admin Panel (not just `.env`)
2. Check email credentials are correct
3. Verify SMTP port (587 or 465)
4. Some hosting providers block port 25
5. Check if authentication is enabled
6. Send a test email from Admin Panel

### Session/login issues?

1. Ensure `SESSION_SECRET` is set in `.env`
2. Use a strong random string (at least 32 characters)
3. Different secret for development and production
4. Clear browser cookies and try again

---

## 10. Security Best Practices

1. **Never commit `.env` file** to version control
   - Add `.env` to `.gitignore` (already done)
   - Only commit `.env.example`

2. **Use strong secrets**
   - Generate random strings for SESSION_SECRET and WEBHOOK_SECRET
   - Different secrets for development and production
   - At least 32 characters long

3. **Backup your `.env` file**
   - Store securely (password manager, encrypted storage)
   - Don't email or share publicly

4. **Restrict database access**
   - Only allow connections from your server IP
   - Use strong database passwords
   - Don't use root database user

5. **Use HTTPS in production**
   - Always use `https://` for production URLs
   - Enable SSL certificate in cPanel
   - Force HTTPS redirect

---

## Need Help?

If you encounter issues:

1. Check the deployment guides:
   - `CPANEL_DEPLOYMENT_GUIDE.md` - For cPanel hosting
   - `EMAIL_INBOX_SETUP.md` - For email configuration

2. Verify all required fields are filled in `.env`

3. Check application logs for error messages

4. Ensure database is accessible from your server
