# Medication Reminder Testing Guide

## Overview

The reminder system runs automatically every minute using Spring's `@Scheduled` annotation. This guide explains how to test and verify that reminders are working correctly.

## How Reminders Work

1. **Scheduler**: Runs every 60 seconds (`@Scheduled(fixedRate = 60000)`)
2. **Query**: Finds reminders where `next_reminder_at <= current_time` and `status = 'PENDING'`
3. **Processing**: Sends SMS/Email notifications and updates reminder status
4. **Next Reminder**: Calculates the next reminder time based on days of week

## Testing Methods

### Method 1: Create a Test Reminder (Recommended)

1. **Create a medication** (if you don't have one):
   ```bash
   POST /api/medications
   {
     "familyMemberId": 1,
     "name": "Test Medication",
     "dosage": "100mg",
     "frequency": "DAILY",
     "startDate": "2025-12-19",
     "endDate": "2025-12-31"
   }
   ```

2. **Create a reminder with current time + 1 minute**:
   ```bash
   POST /api/medications/{medicationId}/reminders
   {
     "reminderTime": "HH:mm",  # Set to current time + 1-2 minutes
     "reminderType": "EMAIL",  # Use EMAIL for easier testing
     "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
   }
   ```

   **Example**: If current time is 10:30 AM, set `reminderTime` to "10:31" or "10:32"

3. **Wait 1-2 minutes** and check:
   - Email inbox (if EMAIL or BOTH)
   - SMS (if SMS or BOTH)
   - Backend logs
   - Database: Check `medication_reminders` table

### Method 2: Manual Trigger (Test Endpoint)

Use the test endpoint to manually trigger reminder processing:

```bash
POST /api/test/reminders/process
Authorization: Bearer {token}
```

This will immediately process all due reminders without waiting for the scheduler.

### Method 3: Database Direct Testing

1. **Create a reminder via API** (to get proper structure)

2. **Update the reminder in database** to set `next_reminder_at` to current time:
   ```sql
   UPDATE medication_reminders 
   SET next_reminder_at = NOW(), 
       status = 'PENDING'
   WHERE id = {reminder_id};
   ```

3. **Wait for scheduler** (runs every minute) or use test endpoint

4. **Check results**:
   ```sql
   SELECT id, status, last_sent_at, next_reminder_at 
   FROM medication_reminders 
   WHERE id = {reminder_id};
   ```

## Verification Steps

### 1. Check Backend Logs

Look for log messages:
```
INFO  - Processing X due reminders
INFO  - Reminder {id} processed successfully
INFO  - Email sent successfully to: {email}
INFO  - SMS sent successfully to: {phone}
```

### 2. Check Database

```sql
-- Check reminder status
SELECT 
    id,
    reminder_time,
    days_of_week,
    reminder_type,
    status,
    last_sent_at,
    next_reminder_at,
    created_at
FROM medication_reminders
ORDER BY created_at DESC
LIMIT 10;

-- Check for processed reminders
SELECT * FROM medication_reminders 
WHERE status = 'SENT' 
ORDER BY last_sent_at DESC;
```

### 3. Check Email/SMS

- **Email**: Check your inbox (and spam folder)
- **SMS**: Check your phone (if Twilio is configured)

### 4. Check API Response

After creating a reminder, check the response:
```json
{
  "success": true,
  "message": "Reminder created successfully",
  "data": {
    "id": 1,
    "reminderTime": "10:35:00",
    "daysOfWeek": [1, 5, 6, 2, 3, 0, 4],
    "reminderType": "BOTH",
    "status": "PENDING",
    "nextReminderAt": "2025-12-19T10:35:00"
  }
}
```

## Testing Scenarios

### Scenario 1: Immediate Reminder (Current Time)

1. Get current time: `date +%H:%M` (or check your system time)
2. Create reminder with time = current time + 1 minute
3. Wait 1-2 minutes
4. Verify notification received

### Scenario 2: Daily Reminder

1. Create reminder with `daysOfWeek: []` (empty array = daily)
2. Set `reminderTime` to a few minutes from now
3. Wait for reminder to trigger
4. Verify `next_reminder_at` is set to tomorrow at same time

### Scenario 3: Weekly Reminder

1. Create reminder with specific days: `["Monday", "Friday"]`
2. Set `reminderTime` appropriately
3. Verify `next_reminder_at` is set to next matching day

### Scenario 4: Multiple Reminders

1. Create multiple reminders for different times
2. Verify all are processed when due
3. Check logs for batch processing

## Troubleshooting

### Reminders Not Processing

1. **Check Scheduler is Enabled**:
   - Verify `@EnableScheduling` is in `MediTrackApplication.java`
   - Check backend logs for scheduler startup

2. **Check Reminder Status**:
   ```sql
   SELECT status, COUNT(*) 
   FROM medication_reminders 
   GROUP BY status;
   ```

3. **Check Next Reminder Time**:
   ```sql
   SELECT id, next_reminder_at, NOW() as current_time,
          next_reminder_at <= NOW() as is_due
   FROM medication_reminders
   WHERE status = 'PENDING';
   ```

4. **Check Backend Logs**:
   - Look for "Processing X due reminders" every minute
   - Check for errors in reminder processing

### Notifications Not Sending

1. **Email Issues**:
   - Check SMTP configuration in `.env`
   - Verify email credentials
   - Check spam folder
   - Check backend logs for email errors

2. **SMS Issues**:
   - Verify Twilio credentials in `.env`
   - Check phone number format (must include country code)
   - Check Twilio account balance
   - Check backend logs for SMS errors

3. **User Phone/Email**:
   - Verify user has phone number (for SMS)
   - Verify user has email (for EMAIL)
   - Check user profile in database

## Quick Test Script

```bash
# 1. Login and get token
TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.data.token')

# 2. Create medication
MED_ID=$(curl -s -X POST http://localhost:8081/api/medications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "familyMemberId": 1,
    "name": "Test Medication",
    "dosage": "100mg",
    "frequency": "DAILY",
    "startDate": "2025-12-19"
  }' | jq -r '.data.id')

# 3. Get current time + 2 minutes
CURRENT_TIME=$(date +%H:%M)
# Calculate next minute (simplified - adjust as needed)
NEXT_MINUTE=$(date -v+2M +%H:%M 2>/dev/null || date -d "+2 minutes" +%H:%M)

# 4. Create reminder
curl -X POST "http://localhost:8081/api/medications/$MED_ID/reminders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"reminderTime\": \"$NEXT_MINUTE\",
    \"reminderType\": \"EMAIL\",
    \"daysOfWeek\": [\"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\", \"Sunday\"]
  }"

# 5. Wait 2 minutes, then manually trigger
sleep 120
curl -X POST http://localhost:8081/api/test/reminders/process \
  -H "Authorization: Bearer $TOKEN"
```

## Expected Behavior

### When Reminder is Due:

1. ✅ Reminder status changes from `PENDING` → `SENT`
2. ✅ `last_sent_at` is set to current timestamp
3. ✅ `next_reminder_at` is calculated for next occurrence
4. ✅ Email/SMS is sent (if configured)
5. ✅ Log entry: "Reminder {id} processed successfully"

### When Medication is Expired:

1. ✅ Reminder status changes to `COMPLETED`
2. ✅ No notification is sent
3. ✅ Reminder is not processed again

## Monitoring

### Check Scheduler Activity

Monitor backend logs for:
```
INFO  - Processing 0 due reminders  (every minute)
INFO  - Processing 1 due reminders  (when reminder is due)
```

### Database Queries

```sql
-- Active reminders
SELECT COUNT(*) FROM medication_reminders WHERE status = 'PENDING';

-- Processed today
SELECT COUNT(*) FROM medication_reminders 
WHERE status = 'SENT' 
AND DATE(last_sent_at) = CURRENT_DATE;

-- Next reminders (next 24 hours)
SELECT id, reminder_time, next_reminder_at 
FROM medication_reminders 
WHERE status = 'PENDING' 
AND next_reminder_at <= NOW() + INTERVAL '24 hours'
ORDER BY next_reminder_at;
```

## Notes

- Scheduler runs every **60 seconds** (1 minute)
- Reminders are processed when `next_reminder_at <= current_time`
- Only `PENDING` reminders are processed
- Expired medications automatically mark reminders as `COMPLETED`
- Email/SMS requires proper configuration in `.env` file

