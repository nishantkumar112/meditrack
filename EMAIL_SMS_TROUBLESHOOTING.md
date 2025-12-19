# Email and SMS Troubleshooting Guide

## Quick Diagnostic Steps

### 1. Check Configuration

Use the test endpoint to check your configuration:

```bash
POST /api/test/notifications/check-config
Authorization: Bearer {token}
```

This will show you what's configured and what's missing.

### 2. Test Email

```bash
POST /api/test/notifications/test-email?email=your@email.com
Authorization: Bearer {token}
```

### 3. Test SMS

```bash
POST /api/test/notifications/test-sms?phoneNumber=+1234567890
Authorization: Bearer {token}
```

## Common Issues and Solutions

### Email Issues

#### Issue 1: "Email not configured" or "MAIL_USERNAME is missing"

**Solution:**
1. Check your `backend/.env` file exists
2. Add these variables:
   ```bash
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   ```
3. **Important for Gmail**: You MUST use an **App Password**, not your regular password
4. Restart the backend after updating `.env`

#### Issue 2: "Authentication failed" or "Login failed"

**For Gmail:**
1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "MediTrack" as the name
   - Copy the 16-character password
   - Use this password in `MAIL_PASSWORD` (not your regular password)

**For Other Email Providers:**
- Check SMTP settings for your provider
- Some providers require different ports (465 for SSL, 587 for TLS)
- Verify your email provider allows SMTP access

#### Issue 3: Email sent but not received

**Check:**
1. **Spam/Junk folder** - Check your spam folder
2. **Email address** - Verify the email address in your user profile
3. **Backend logs** - Look for "Email sent successfully" message
4. **Email provider** - Some providers block automated emails

#### Issue 4: Connection timeout

**Solution:**
- Check your internet connection
- Verify firewall isn't blocking port 587
- Try different SMTP port (465 for SSL)
- Check if your email provider requires VPN

### SMS Issues

#### Issue 1: "Twilio credentials not configured"

**Solution:**
1. Check your `backend/.env` file
2. Add these variables:
   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```
3. Get credentials from: https://console.twilio.com/
4. Restart the backend after updating `.env`

#### Issue 2: "Phone number format invalid"

**Solution:**
- Phone numbers MUST include country code
- Format: `+[country code][number]`
- Examples:
  - US: `+1234567890`
  - India: `+919876543210`
  - UK: `+441234567890`
- No spaces, dashes, or parentheses

#### Issue 3: "User phone number not set"

**Solution:**
1. Check your user profile has a phone number
2. Update profile via API or frontend
3. Phone number must be in international format: `+[country][number]`

#### Issue 4: "Insufficient funds" or "Account suspended"

**Solution:**
- Check your Twilio account balance
- Verify account is active at: https://console.twilio.com/
- Add funds if needed

## Step-by-Step Setup

### Email Setup (Gmail Example)

1. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name: "MediTrack"
   - Copy the 16-character password

3. **Update `.env` file:**
   ```bash
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=xxxx xxxx xxxx xxxx  # 16-char app password (no spaces)
   ```

4. **Restart backend:**
   ```bash
   cd backend
   ./start-backend.sh
   ```

5. **Test:**
   ```bash
   POST /api/test/notifications/test-email?email=your@email.com
   ```

### SMS Setup (Twilio Example)

1. **Create Twilio Account:**
   - Sign up at: https://www.twilio.com/try-twilio
   - Verify your phone number

2. **Get Credentials:**
   - Go to: https://console.twilio.com/
   - Copy Account SID and Auth Token
   - Get a phone number (or use trial number)

3. **Update `.env` file:**
   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio number
   ```

4. **Restart backend**

5. **Test:**
   ```bash
   POST /api/test/notifications/test-sms?phoneNumber=+1234567890
   ```

## Verification Checklist

### Email
- [ ] `MAIL_HOST` is set in `.env`
- [ ] `MAIL_USERNAME` is set (your email)
- [ ] `MAIL_PASSWORD` is set (App Password for Gmail)
- [ ] Backend restarted after updating `.env`
- [ ] Test endpoint shows "configCheck: OK"
- [ ] Test email sent successfully
- [ ] Email received (check spam folder)

### SMS
- [ ] `TWILIO_ACCOUNT_SID` is set in `.env`
- [ ] `TWILIO_AUTH_TOKEN` is set in `.env`
- [ ] `TWILIO_PHONE_NUMBER` is set in `.env`
- [ ] Backend restarted after updating `.env`
- [ ] Test endpoint shows "configCheck: OK"
- [ ] User profile has phone number (international format)
- [ ] Test SMS sent successfully
- [ ] SMS received on phone

## Backend Logs to Check

### Successful Email:
```
DEBUG - Attempting to send email to: user@example.com, subject: Medication Reminder
INFO - Email sent successfully to: user@example.com
```

### Failed Email:
```
ERROR - Failed to send email to: user@example.com. Error: Authentication failed
```

### Successful SMS:
```
DEBUG - Attempting to send SMS to: +1234567890
INFO - SMS sent successfully to: +1234567890
```

### Failed SMS:
```
WARN - Twilio credentials not configured. SMS not sent to: +1234567890
```
or
```
ERROR - Failed to send SMS to: +1234567890. Error: [error message]
```

## Testing Reminders

After fixing email/SMS configuration:

1. **Create a reminder** with type EMAIL or SMS
2. **Set reminder time** to current time + 2 minutes
3. **Manually trigger** or wait for scheduler:
   ```bash
   POST /api/test/reminders/process
   ```
4. **Check logs** for success/failure messages
5. **Verify** email/SMS received

## Alternative Email Providers

### Outlook/Hotmail
```bash
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
```

### Yahoo
```bash
MAIL_HOST=smtp.mail.yahoo.com
MAIL_PORT=587
```

### Custom SMTP
```bash
MAIL_HOST=your-smtp-server.com
MAIL_PORT=587  # or 465 for SSL
```

## Still Not Working?

1. **Check backend logs** - Look for error messages
2. **Verify `.env` file** - Make sure variables are set correctly
3. **Test endpoints** - Use `/api/test/notifications/test-email` and `/api/test/notifications/test-sms`
4. **Check user profile** - Verify email and phone number are set
5. **Check reminder type** - Make sure reminder is set to EMAIL, SMS, or BOTH
6. **Verify reminder was processed** - Check database for `last_sent_at` timestamp

## Quick Test Commands

```bash
# Check configuration
curl -X POST "http://localhost:8081/api/test/notifications/check-config" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test email
curl -X POST "http://localhost:8081/api/test/notifications/test-email?email=your@email.com" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test SMS
curl -X POST "http://localhost:8081/api/test/notifications/test-sms?phoneNumber=+1234567890" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

