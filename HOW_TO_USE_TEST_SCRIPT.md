# How to Use test_reminder.sh

## Prerequisites

1. **Backend must be running** on `http://localhost:8081`
2. **You must have a user account** registered in the system
3. **You must have at least one family member** added to your account
4. **Email/SMS configuration** should be set up in `.env` (for notifications)

## Step-by-Step Usage

### 1. Navigate to Project Directory

```bash
cd /Users/nishantatras/Desktop/Meditrack
```

### 2. Make Script Executable (if not already)

```bash
chmod +x test_reminder.sh
```

### 3. Run the Script

```bash
./test_reminder.sh
```

### 4. Follow the Interactive Prompts

The script will guide you through:

#### Step 1: Login
```
Enter your email: your@email.com
Enter your password: [password hidden]
```
- Enter your registered email
- Enter your password (input is hidden for security)

#### Step 2: Automatic Family Member Detection
- Script automatically finds your first family member
- If no family members exist, script will exit with an error

#### Step 3: Automatic Medication Creation
- Script creates a test medication automatically
- Medication name: "Test Medication"
- Dosage: "100mg"
- Frequency: "DAILY"

#### Step 4: Automatic Reminder Creation
- Script calculates current time + 2 minutes
- Creates a reminder for that time
- Reminder type: EMAIL (for easier testing)

#### Step 5: Choose Testing Option

You'll be prompted to choose:

**Option 1: Wait for Automatic Processing**
- Scheduler runs every minute
- Wait 2-3 minutes for automatic processing
- Check email and backend logs

**Option 2: Manually Trigger Reminder Processing** (Recommended)
- Immediately processes all due reminders
- No waiting required
- Check email and backend logs right away

**Option 3: Check Database Status**
- Shows SQL query to run in pgAdmin/psql
- Check reminder status directly in database

## Example Session

```bash
$ ./test_reminder.sh

=== MediTrack Reminder Testing Script ===

Step 1: Please login to get your token
Enter your email: user@example.com
Enter your password: 

Logging in...
✅ Login successful!

Step 2: Fetching family members...
✅ Found family member ID: 1

Step 3: Creating test medication...
✅ Medication created with ID: 5

Step 4: Creating reminder for 14:32 (2 minutes from now)...
✅ Reminder created with ID: 3

=== Testing Options ===
1. Wait for automatic processing (scheduler runs every minute)
2. Manually trigger reminder processing now
3. Check reminder status in database

Select option (1, 2, or 3): 2

Step 5: Manually triggering reminder processing...
Response: {"success":true,"message":"Reminders processed successfully",...}

✅ Reminder processing triggered!
Check your email and backend logs for results.

=== Testing Complete ===
Reminder ID: 3
Medication ID: 5
Reminder Time: 14:32

To check status, use:
  GET http://localhost:8081/api/medications/5
  Authorization: Bearer [token]
```

## What the Script Does

1. ✅ **Authenticates** you with the backend
2. ✅ **Finds** your first family member
3. ✅ **Creates** a test medication
4. ✅ **Creates** a reminder for 2 minutes from now
5. ✅ **Gives you options** to test the reminder

## Verification Steps

After running the script:

### 1. Check Email
- Look in your inbox (and spam folder)
- You should receive a medication reminder email

### 2. Check Backend Logs
Look for these messages:
```
INFO - Processing 1 due reminders
INFO - Reminder 3 processed successfully
INFO - Email sent successfully to: user@example.com
```

### 3. Check Database (Option 3)
Run the SQL query shown by the script:
```sql
SELECT id, reminder_time, status, last_sent_at, next_reminder_at
FROM medication_reminders
WHERE id = 3;
```

Expected results:
- `status` = `SENT`
- `last_sent_at` = current timestamp
- `next_reminder_at` = next scheduled time

## Troubleshooting

### Script Fails at Login
- **Check**: Backend is running on port 8081
- **Check**: Email and password are correct
- **Check**: User account exists

### Script Fails at Family Member Step
- **Error**: "No family members found"
- **Solution**: Add a family member first via the frontend or API

### Script Fails at Medication Creation
- **Check**: Backend logs for error messages
- **Check**: Database connection is working
- **Check**: Family member ID is valid

### Script Fails at Reminder Creation
- **Check**: Medication was created successfully
- **Check**: Reminder time format is correct
- **Check**: Backend logs for validation errors

### No Email Received
- **Check**: SMTP configuration in `.env`
- **Check**: Email address in user profile
- **Check**: Spam folder
- **Check**: Backend logs for email errors

### Manual Trigger Doesn't Work
- **Check**: Backend is running
- **Check**: Token is valid
- **Check**: Reminder `next_reminder_at` is set correctly
- **Check**: Reminder status is `PENDING`

## Alternative: Manual Testing

If the script doesn't work, you can test manually:

1. **Login** via API to get token
2. **Create medication** via API
3. **Create reminder** with time = current time + 2 minutes
4. **Manually trigger**: `POST /api/test/reminders/process`

See `REMINDER_TESTING_GUIDE.md` for detailed manual steps.

## Notes

- Script uses `curl` for API calls
- Script uses `grep` and `cut` to parse JSON responses
- Script calculates reminder time automatically
- Script creates test data that you can delete later
- All test data uses standard values (can be customized in script)

## Customization

You can edit the script to:
- Change medication name/dosage
- Change reminder type (SMS, EMAIL, BOTH)
- Change reminder time offset (currently 2 minutes)
- Add more family members
- Customize test data

