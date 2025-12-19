# Quick Fix: Email and SMS Not Working

## Immediate Steps to Diagnose

### 1. Check Your Configuration

Run this command to see what's configured:

```bash
POST http://localhost:8081/api/test/notifications/check-config
Authorization: Bearer {your_token}
```

### 2. Test Email Directly

```bash
POST http://localhost:8081/api/test/notifications/test-email?email=your@email.com
Authorization: Bearer {your_token}
```

### 3. Test SMS Directly

```bash
POST http://localhost:8081/api/test/notifications/test-sms?phoneNumber=+1234567890
Authorization: Bearer {your_token}
```

## Most Common Issues

### Issue 1: Missing Configuration in `.env`

**Check your `backend/.env` file has:**

```bash
# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password  # NOT your regular password!

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Important:** After updating `.env`, restart the backend!

### Issue 2: Gmail Requires App Password

**You CANNOT use your regular Gmail password!**

1. Go to: https://myaccount.google.com/apppasswords
2. Generate an App Password for "Mail"
3. Use that 16-character password in `MAIL_PASSWORD`

### Issue 3: User Profile Missing Email/Phone

- Check your user profile has an email address
- Check your user profile has a phone number (for SMS)
- Phone number must be in international format: `+[country][number]`

### Issue 4: Reminder Type Not Set Correctly

- Reminder must be set to `EMAIL`, `SMS`, or `BOTH`
- Check the reminder configuration

## Quick Test Checklist

1. ✅ Configuration check endpoint shows all values set
2. ✅ Test email endpoint sends successfully
3. ✅ Test SMS endpoint sends successfully
4. ✅ User profile has email/phone
5. ✅ Reminder type is EMAIL/SMS/BOTH
6. ✅ Backend logs show "sent successfully" messages
7. ✅ Check spam folder for emails

## Check Backend Logs

Look for these messages:

**Success:**
```
INFO - Email sent successfully to: user@example.com
INFO - SMS sent successfully to: +1234567890
```

**Failure:**
```
ERROR - Failed to send email to: user@example.com. Error: Authentication failed
WARN - Twilio credentials not configured. SMS not sent to: +1234567890
```

## Still Not Working?

1. **Check backend logs** - Look for error messages
2. **Use test endpoints** - They will show exact error messages
3. **Verify `.env` file** - Make sure it's in the `backend/` directory
4. **Restart backend** - After changing `.env`, always restart
5. **Check email provider** - Some providers block automated emails

See `EMAIL_SMS_TROUBLESHOOTING.md` for detailed solutions.

