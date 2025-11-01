# Simple cPanel Email Forwarding Setup

This guide shows the easiest way to forward emails to your Duke Consultancy Email Inbox using only cPanel - no scripts needed.

## Prerequisites

- Access to your cPanel account
- Your application deployed and accessible via a domain
- An email account set up in cPanel (e.g., admin@yourdomain.com)

## Step 1: Get Your Webhook URL

Your webhook endpoint is: `https://yourdomain.com/api/email/webhook/incoming`

Replace `yourdomain.com` with your actual domain.

## Step 2: Set Up Email Forwarder in cPanel

### Using cPanel Email Forwarders

1. **Log into cPanel**
   - Go to your cPanel dashboard

2. **Navigate to Email Forwarders**
   - In the "Email" section, click "Forwarders"

3. **Add a Forwarder**
   - Click "Add Forwarder"
   - In "Address to Forward" field: Enter the email that receives candidate replies (e.g., `admin`)
   - For "Domain": Select your domain from dropdown
   - In "Destination" section: Select "Forward to email address"
   - Enter an email that will also receive the messages (backup)

### Using Email Filters (For Webhook Integration)

Since cPanel doesn't directly support HTTP webhooks in email forwarders, you'll need to use **Zapier** or **Make.com** as a bridge:

## Alternative: Using Zapier (Recommended for cPanel)

### Option 1: Zapier Integration (Free tier available)

1. **Create a Zapier Account**
   - Go to https://zapier.com and sign up (free plan works)

2. **Create a New Zap**
   - Click "Create Zap"
   - Name it: "Email to Duke Webhook"

3. **Set Up Trigger**
   - Choose trigger app: "Email by Zapier"
   - Trigger event: "New Inbound Email"
   - You'll get a custom email address like: `yourname123@robot.zapier.com`

4. **Set Up Action**
   - Choose action app: "Webhooks by Zapier"
   - Action event: "POST"
   - URL: `https://yourdomain.com/api/email/webhook/incoming`
   - Payload Type: "JSON"
   - Data:
     ```
     from_email: {{from_email}}
     from_name: {{from_name}}
     to_email: {{to_email}}
     subject: {{subject}}
     body: {{body_plain}}
     ```
   - Headers:
     ```
     Content-Type: application/json
     X-Webhook-Secret: your-webhook-secret-here
     ```

5. **Test the Zap**
   - Send a test email
   - Verify it appears in your Duke admin panel

6. **Forward cPanel Emails to Zapier**
   - In cPanel > Forwarders
   - Forward your admin email to the Zapier email address
   - Example: admin@yourdomain.com → yourname123@robot.zapier.com

### Option 2: Make.com (Integromat)

Similar process but using Make.com:

1. Create a scenario with Email webhook trigger
2. Add HTTP module to send POST request to your webhook
3. Forward cPanel email to Make.com email address

## Step 3: Configure Webhook Secret

1. **In your project files**, you need to set the webhook secret
2. This will be configured in your `.env` file (see deployment guide)
3. Use the same secret you entered in Zapier headers

## Simple Testing

1. **Send a test email** to your configured email (e.g., admin@yourdomain.com)
2. **Check Zapier logs** to see if it was received and forwarded
3. **Check Email Inbox** in Duke admin panel
4. Email should appear with all details

## Note

cPanel doesn't natively support HTTP webhooks for email forwarding. Using Zapier or Make.com is the easiest solution without custom server-side scripts. Both offer free tiers that are sufficient for moderate email volumes.

If you prefer a completely self-hosted solution, you would need to:
1. Set up a separate email server (like Postfix) with webhook support
2. Use the PHP script method from EMAIL_INBOX_SETUP.md
3. Configure email piping in cPanel (advanced)
