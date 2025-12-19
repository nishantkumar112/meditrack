# Quick Guide: Testing Medication Reminders

## Quick Test Steps

### Step 1: Create a Medication
```bash
POST http://localhost:8081/api/medications
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "familyMemberId": 1,
  "name": "Test Medication",
  "dosage": "100mg",
  "frequency": "DAILY",
  "startDate": "2025-12-19",
  "endDate": "2025-12-31"
}
```

Save the `id` from the response (e.g., `medicationId = 1`)

### Step 2: Create a Reminder (Set to Current Time + 2 Minutes)

**Get current time:**
```bash
# On Mac/Linux
date +%H:%M

# Example output: 10:45
```

**Create reminder:**
```bash
POST http://localhost:8081/api/medications/{medicationId}/reminders
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "reminderTime": "10:47",  # Current time + 2 minutes
  "reminderType": "EMAIL",  # Use EMAIL for easier testing
  "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
}
```

### Step 3: Wait and Verify

**Option A: Wait 2-3 minutes** (scheduler runs every minute)

**Option B: Manually trigger immediately:**
```bash
POST http://localhost:8081/api/test/reminders/process
Authorization: Bearer {your_token}
```

### Step 4: Check Results

1. **Check Email** - You should receive an email notification
2. **Check Backend Logs** - Look for:
   ```
   INFO - Processing 1 due reminders
   INFO - Reminder 1 processed successfully
   INFO - Email sent successfully to: your@email.com
   ```
3. **Check Database:**
   ```sql
   SELECT id, status, last_sent_at, next_reminder_at 
   FROM medication_reminders 
   WHERE id = {reminder_id};
   ```
   - `status` should be `SENT`
   - `last_sent_at` should have a timestamp
   - `next_reminder_at` should be set to next occurrence

## Testing Checklist

- [ ] Medication created successfully
- [ ] Reminder created successfully
- [ ] Reminder has `next_reminder_at` set correctly
- [ ] Reminder status is `PENDING`
- [ ] After trigger, status changes to `SENT`
- [ ] Email/SMS notification received
- [ ] `last_sent_at` is updated
- [ ] `next_reminder_at` is calculated for next occurrence
- [ ] Backend logs show processing messages

## Common Issues

**Reminder not processing:**
- Check `next_reminder_at` is set and <= current time
- Check reminder status is `PENDING`
- Verify scheduler is running (check logs every minute)
- Use manual trigger endpoint to test

**Email not received:**
- Check SMTP configuration in `.env`
- Check spam folder
- Verify user email in database
- Check backend logs for email errors

**SMS not received:**
- Check Twilio credentials in `.env`
- Verify user phone number format (+country code)
- Check Twilio account balance
- Check backend logs for SMS errors

