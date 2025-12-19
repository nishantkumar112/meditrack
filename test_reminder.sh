#!/bin/bash

# Quick Reminder Testing Script
# This script helps you test medication reminders

BASE_URL="http://localhost:8081/api"
TOKEN=""

echo "=== MediTrack Reminder Testing Script ==="
echo ""

# Step 1: Login
echo "Step 1: Please login to get your token"
echo "Enter your email: "
read EMAIL
echo "Enter your password: "
read -s PASSWORD

echo ""
echo "Logging in..."

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed. Please check your credentials."
  exit 1
fi

echo "✅ Login successful!"
echo ""

# Step 2: Get family members
echo "Step 2: Fetching family members..."
FAMILY_MEMBERS=$(curl -s -X GET "$BASE_URL/family-members" \
  -H "Authorization: Bearer $TOKEN")

FAMILY_MEMBER_ID=$(echo $FAMILY_MEMBERS | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

if [ -z "$FAMILY_MEMBER_ID" ]; then
  echo "❌ No family members found. Please create a family member first."
  exit 1
fi

echo "✅ Found family member ID: $FAMILY_MEMBER_ID"
echo ""

# Step 3: Create medication
echo "Step 3: Creating test medication..."
MED_RESPONSE=$(curl -s -X POST "$BASE_URL/medications" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"familyMemberId\": $FAMILY_MEMBER_ID,
    \"name\": \"Test Medication\",
    \"dosage\": \"100mg\",
    \"frequency\": \"DAILY\",
    \"startDate\": \"$(date +%Y-%m-%d)\"
  }")

MED_ID=$(echo $MED_RESPONSE | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

if [ -z "$MED_ID" ]; then
  echo "❌ Failed to create medication"
  echo "Response: $MED_RESPONSE"
  exit 1
fi

echo "✅ Medication created with ID: $MED_ID"
echo ""

# Step 4: Calculate reminder time (current time + 2 minutes)
CURRENT_HOUR=$(date +%H)
CURRENT_MIN=$(date +%M)
NEXT_MIN=$((CURRENT_MIN + 2))
if [ $NEXT_MIN -ge 60 ]; then
  NEXT_MIN=$((NEXT_MIN - 60))
  NEXT_HOUR=$((CURRENT_HOUR + 1))
  if [ $NEXT_HOUR -ge 24 ]; then
    NEXT_HOUR=0
  fi
else
  NEXT_HOUR=$CURRENT_HOUR
fi

REMINDER_TIME=$(printf "%02d:%02d" $NEXT_HOUR $NEXT_MIN)

echo "Step 4: Creating reminder for $REMINDER_TIME (2 minutes from now)..."
REMINDER_RESPONSE=$(curl -s -X POST "$BASE_URL/medications/$MED_ID/reminders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"reminderTime\": \"$REMINDER_TIME\",
    \"reminderType\": \"EMAIL\",
    \"daysOfWeek\": [\"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\", \"Sunday\"]
  }")

REMINDER_ID=$(echo $REMINDER_RESPONSE | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

if [ -z "$REMINDER_ID" ]; then
  echo "❌ Failed to create reminder"
  echo "Response: $REMINDER_RESPONSE"
  exit 1
fi

echo "✅ Reminder created with ID: $REMINDER_ID"
echo ""

# Step 5: Options
echo "=== Testing Options ==="
echo "1. Wait for automatic processing (scheduler runs every minute)"
echo "2. Manually trigger reminder processing now"
echo "3. Check reminder status in database"
echo ""
echo "Select option (1, 2, or 3): "
read OPTION

case $OPTION in
  1)
    echo ""
    echo "⏳ Waiting for automatic scheduler..."
    echo "The scheduler runs every minute. Your reminder is set for $REMINDER_TIME"
    echo "Check your email and backend logs for results."
    ;;
  2)
    echo ""
    echo "Step 5: Manually triggering reminder processing..."
    TRIGGER_RESPONSE=$(curl -s -X POST "$BASE_URL/test/reminders/process" \
      -H "Authorization: Bearer $TOKEN")
    echo "Response: $TRIGGER_RESPONSE"
    echo ""
    echo "✅ Reminder processing triggered!"
    echo "Check your email and backend logs for results."
    ;;
  3)
    echo ""
    echo "Run this SQL query in pgAdmin or psql:"
    echo ""
    echo "SELECT id, reminder_time, status, last_sent_at, next_reminder_at"
    echo "FROM medication_reminders"
    echo "WHERE id = $REMINDER_ID;"
    ;;
  *)
    echo "Invalid option"
    ;;
esac

echo ""
echo "=== Testing Complete ==="
echo "Reminder ID: $REMINDER_ID"
echo "Medication ID: $MED_ID"
echo "Reminder Time: $REMINDER_TIME"
echo ""
echo "To check status, use:"
echo "  GET $BASE_URL/medications/$MED_ID"
echo "  Authorization: Bearer $TOKEN"

