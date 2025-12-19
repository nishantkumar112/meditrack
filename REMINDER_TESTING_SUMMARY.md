# Medication Reminder Testing - Quick Reference

## How Reminders Work

1. **Automatic Scheduler**: Runs every **60 seconds** (1 minute)
2. **Finds Due Reminders**: Queries reminders where `next_reminder_at <= NOW()` and `status = 'PENDING'`
3. **Sends Notifications**: Email and/or SMS based on `reminder_type`
4. **Updates Status**: Changes to `SENT`, sets `last_sent_at`, calculates `next_reminder_at`

## Quick Test (3 Steps)

### 1. Create Medication
```bash
POST /api/medications
{
  "familyMemberId": 1,
  "name": "Test Medication",
  "dosage": "100mg",
  "frequency": "DAILY",
  "startDate": "2025-12-19"
}
```

### 2. Create Reminder (Set to Current Time + 2 Minutes)
```bash
# Get current time
date +%H:%M  # Example: 10:45

# Create reminder for 10:47 (2 minutes later)
POST /api/medications/{medicationId}/reminders
{
  "reminderTime": "10:47",
  "reminderType": "EMAIL",
  "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
}
```

### 3. Verify

**Option A: Wait 2-3 minutes** (automatic scheduler)

**Option B: Manual trigger** (immediate):
```bash
POST /api/test/reminders/process
Authorization: Bearer {token}
```

## Verification Checklist

- [ ] **Email Received**: Check inbox (and spam)
- [ ] **Backend Logs**: Look for "Processing X due reminders" and "Reminder processed successfully"
- [ ] **Database**: Check `medication_reminders` table:
  - `status` = `SENT`
  - `last_sent_at` has timestamp
  - `next_reminder_at` is set to next occurrence

## Test Endpoints

### Manual Trigger
```bash
POST /api/test/reminders/process
```
Manually processes all due reminders immediately.

### Check Status
```bash
GET /api/test/reminders/status
```
Returns reminder system status and configuration.

## Database Queries

### Find Due Reminders
```sql
SELECT id, reminder_time, status, next_reminder_at
FROM medication_reminders
WHERE status = 'PENDING'
  AND next_reminder_at <= NOW();
```

### Check Reminder Status
```sql
SELECT id, status, last_sent_at, next_reminder_at
FROM medication_reminders
WHERE id = {reminder_id};
```

### Set Reminder to Due Now (for testing)
```sql
UPDATE medication_reminders 
SET next_reminder_at = NOW(),
    status = 'PENDING'
WHERE id = {reminder_id};
```

## Expected Results

### When Reminder is Processed:
- ✅ Status: `PENDING` → `SENT`
- ✅ `last_sent_at`: Current timestamp
- ✅ `next_reminder_at`: Next scheduled time
- ✅ Email/SMS sent (if configured)
- ✅ Log: "Reminder {id} processed successfully"

### Backend Logs Should Show:
```
INFO - Processing 1 due reminders
INFO - Reminder 1 processed successfully
INFO - Email sent successfully to: user@example.com
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Reminder not processing | Check `next_reminder_at <= NOW()` and `status = 'PENDING'` |
| No email received | Check SMTP config, spam folder, user email |
| No SMS received | Check Twilio config, phone number format, account balance |
| Scheduler not running | Verify `@EnableScheduling` in application class |

## Testing Tools

1. **Postman Collection**: Import `MediTrack_API_Collection.postman_collection.json`
2. **Test Script**: Run `./test_reminder.sh`
3. **SQL Scripts**: Use `backend/test_reminders.sql`
4. **Manual Trigger**: Use `/api/test/reminders/process` endpoint

## Notes

- Scheduler interval: **60 seconds** (1 minute)
- Reminders process when `next_reminder_at <= current_time`
- Only `PENDING` reminders are processed
- Expired medications mark reminders as `COMPLETED`
- Email/SMS requires proper `.env` configuration

