# Email Inbox Setup Guide for cPanel Hosting

This guide explains how to configure your cPanel email service to forward incoming emails to your Duke Consultancy admin panel Email Inbox.

## Overview

The Email Inbox feature captures candidate replies and displays them in the admin panel. To receive emails, you need to configure your cPanel email service to forward incoming messages to the webhook endpoint.

## Step 1: Prepare Your Webhook Endpoint

Your application has a webhook endpoint at: `/api/email/webhook/incoming`

The full URL will be: `https://your-domain.com/api/email/webhook/incoming`

### Set Up Webhook Secret

1. Add a webhook secret to your environment variables for security
2. In your hosting environment, set: `WEBHOOK_SECRET=your-secure-random-string-here`
3. Make sure this matches the secret you'll use in your cPanel configuration

## Step 2: Configure cPanel Email Forwarding

### Option A: Using Email Filters (Recommended)

1. **Log into cPanel**
   - Access your cPanel dashboard
   - Navigate to "Email" section

2. **Set up Email Filters**
   - Click on "Email Filters" or "Global Email Filters"
   - Select the email account that receives candidate replies (e.g., admin@duke.com)

3. **Create a New Filter**
   - Click "Create a New Filter"
   - Name: "Forward to Webhook"
   - Rules:
     - Any header contains "@" (this catches all emails)
   - Actions:
     - "Pipe to a Program" or "Redirect to email"

### Option B: Using Email Forwarders with Script

1. **Create a Forwarder Script**
   - In cPanel File Manager, create a script file (e.g., `/home/username/forward_to_webhook.php`)
   
2. **Add this PHP script**:

```php
<?php
// Read the email from stdin
$email = file_get_contents("php://stdin");

// Parse email headers and body
$headers = [];
$body = '';
$inHeaders = true;

foreach (explode("\n", $email) as $line) {
    if ($inHeaders && trim($line) === '') {
        $inHeaders = false;
        continue;
    }
    
    if ($inHeaders) {
        if (preg_match('/^([^:]+):\s*(.*)$/', $line, $matches)) {
            $headers[strtolower($matches[1])] = trim($matches[2]);
        }
    } else {
        $body .= $line . "\n";
    }
}

// Extract required fields
$from_email = $headers['from'] ?? '';
$to_email = $headers['to'] ?? '';
$subject = $headers['subject'] ?? '';

// Clean up from_email (remove name part)
if (preg_match('/<([^>]+)>/', $from_email, $matches)) {
    $from_name = trim(str_replace(['<', '>', $matches[1]], '', $from_email));
    $from_email = $matches[1];
} else {
    $from_name = '';
}

// Send to webhook
$webhookUrl = 'https://your-domain.com/api/email/webhook/incoming';
$webhookSecret = 'your-secure-random-string-here'; // Must match WEBHOOK_SECRET

$data = [
    'from_email' => $from_email,
    'from_name' => $from_name,
    'to_email' => $to_email,
    'subject' => $subject,
    'body' => trim($body)
];

$ch = curl_init($webhookUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-Webhook-Secret: ' . $webhookSecret
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Log the result (optional)
error_log("Webhook forwarded: HTTP $httpCode");
?>
```

3. **Make the script executable**
   - In cPanel Terminal or SSH: `chmod +x /home/username/forward_to_webhook.php`

4. **Set up Email Forwarder**
   - Go to cPanel > Email > Forwarders
   - Click "Add Forwarder"
   - Forward to: Pipe to Program
   - Program path: `/home/username/forward_to_webhook.php`

### Option C: Using a Third-Party Email Service (Alternative)

If cPanel forwarding is complex, you can use services like:

1. **SendGrid Inbound Parse**
   - Set up SendGrid inbound parse webhook
   - Point it to your webhook endpoint

2. **Mailgun Routes**
   - Configure Mailgun to forward emails to your webhook
   - Use Mailgun's parsing features

3. **Cloudflare Email Routing**
   - Use Cloudflare's email routing to forward to webhook

## Step 3: Test the Integration

1. **Send a test email** to your configured email address
2. **Check the Email Inbox** in your admin panel
3. **Verify** the email appears in the inbox with:
   - Correct sender information
   - Subject line
   - Email body
   - Timestamp

## Troubleshooting

### Emails not appearing in inbox?

1. **Check webhook secret**: Ensure WEBHOOK_SECRET environment variable matches the secret in your forwarder script
2. **Check logs**: Look at your server logs for webhook errors
3. **Test webhook directly**: Use a tool like Postman to test the endpoint:
   ```
   POST https://your-domain.com/api/email/webhook/incoming
   Headers:
     Content-Type: application/json
     X-Webhook-Secret: your-secret
   Body:
     {
       "from_email": "test@example.com",
       "from_name": "Test User",
       "to_email": "admin@duke.com",
       "subject": "Test Email",
       "body": "This is a test message"
     }
   ```

### Email format issues?

- Ensure your forwarder script properly parses email headers
- Check for special characters in subject/body
- Verify email encoding (UTF-8)

## Security Considerations

1. **Always use HTTPS** for webhook endpoints
2. **Validate webhook secret** on every request
3. **Sanitize email content** to prevent XSS attacks (already implemented)
4. **Rate limit** webhook endpoint to prevent abuse
5. **Log all webhook requests** for audit purposes

## Additional Notes

- The Email Inbox stores up to 10,000 characters per email body
- Email addresses are validated using regex
- Read/unread status is tracked automatically
- You can reply to emails using your default email client
