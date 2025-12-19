# Fix: Email Authentication Failed - "no password specified?"

## Problem

The reminder scheduler was failing with:
```
MailAuthenticationException: Authentication failed
Caused by: jakarta.mail.AuthenticationFailedException: failed to connect, no password specified?
```

This indicates that `MAIL_PASSWORD` is either:
- Not set in `.env` file
- Empty/blank in `.env` file
- Not being loaded correctly

## Root Cause

The error "no password specified?" means Spring Boot's `JavaMailSender` cannot authenticate because the password is missing or empty.

## Solution Applied

### 1. Added Email Configuration Validation

The `NotificationService` now checks if email credentials are configured **before** attempting to send:

- Checks if `MAIL_USERNAME` is set
- Checks if `MAIL_PASSWORD` is set (most important!)
- Checks if `MAIL_HOST` is set
- Provides clear warning messages if any are missing

### 2. Improved Error Messages

Now you'll see helpful warnings like:
```
WARN - Email password not configured. MAIL_PASSWORD is missing in .env. 
For Gmail, you must use an App Password (not your regular password). 
Generate one at: https://myaccount.google.com/apppasswords
```

### 3. Fixed Phone Number Format

Also fixed phone number formatting - automatically adds `+` prefix if missing (e.g., `9625184272` → `+9625184272`).

## What You Need to Do

### Step 1: Check Your `.env` File

Make sure `backend/.env` has:

```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password-here  # ⚠️ MUST be set!
```

### Step 2: For Gmail - Use App Password

**You CANNOT use your regular Gmail password!**

1. **Enable 2-Step Verification** (if not already enabled):
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name: "MediTrack"
   - Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

3. **Update `.env`**:
   ```bash
   MAIL_PASSWORD=xxxxxxxxxxxxxxxx  # Use the 16-char app password (no spaces)
   ```

### Step 3: Restart Backend

After updating `.env`, **restart the backend**:

```bash
cd backend
./start-backend.sh
```

### Step 4: Verify Configuration

Test your email configuration:

```bash
POST http://localhost:8081/api/test/notifications/check-config
Authorization: Bearer {token}
```

This will show you what's configured.

### Step 5: Test Email

```bash
POST http://localhost:8081/api/test/notifications/test-email?email=your@email.com
Authorization: Bearer {token}
```

## Expected Behavior After Fix

### Before (Error):
```
ERROR - Failed to send email to: user@example.com. Error: MailAuthenticationException - Authentication failed
```

### After (Warning - if not configured):
```
WARN - Email password not configured. MAIL_PASSWORD is missing in .env. 
Email not sent to: user@example.com
```

### After (Success - if configured):
```
DEBUG - Attempting to send email to: user@example.com, subject: Medication Reminder
INFO - Email sent successfully to: user@example.com
```

## Additional Notes

### Phone Number Format

The phone number `9625184272` was missing the country code prefix. The fix now automatically adds `+` if missing:
- Input: `9625184272`
- Formatted: `+9625184272`

Make sure your user profile has phone numbers in international format: `+[country code][number]`

### Reminder Processing Continues

Even if email/SMS fails, the reminder processing will continue:
- Reminder status will still be updated
- Other reminders will still be processed
- Only the notification fails, not the entire process

## Verification Checklist

- [ ] `MAIL_USERNAME` is set in `backend/.env`
- [ ] `MAIL_PASSWORD` is set in `backend/.env` (App Password for Gmail)
- [ ] `MAIL_HOST` is set in `backend/.env`
- [ ] Backend restarted after updating `.env`
- [ ] Test endpoint shows configuration is OK
- [ ] Test email sends successfully
- [ ] Reminder scheduler runs without authentication errors

## Still Having Issues?

1. **Check backend logs** - Look for the new warning messages
2. **Verify `.env` file** - Make sure it's in `backend/` directory
3. **Check App Password** - Must be 16 characters, no spaces
4. **Test endpoint** - Use `/api/test/notifications/test-email` to get exact error
5. **Check Gmail settings** - Make sure "Less secure app access" is not the issue (use App Password instead)

## Related Files Changed

- `backend/src/main/java/com/meditrack/util/NotificationService.java`
  - Added email configuration validation
  - Improved error messages
  - Fixed phone number formatting

