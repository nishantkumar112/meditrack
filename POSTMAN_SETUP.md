# Postman API Collection Setup Guide

This guide explains how to import and use the MediTrack API collection in Postman.

## Files Included

1. **MediTrack_API_Collection.postman_collection.json** - Complete API collection
2. **MediTrack_Environment.postman_environment.json** - Environment variables

## Import Steps

### 1. Import Collection

1. Open Postman
2. Click **Import** button (top left)
3. Select **MediTrack_API_Collection.postman_collection.json**
4. Click **Import**

### 2. Import Environment

1. Click **Import** button again
2. Select **MediTrack_Environment.postman_environment.json**
3. Click **Import**
4. Select the **MediTrack Environment** from the environment dropdown (top right)

## Configuration

### Environment Variables

The collection uses the following variables:

- **base_url**: `http://localhost:8081` (Backend server URL)
- **token**: JWT token (automatically set after login)

### Setting the Token

After logging in:

1. Run the **Login** request from the **Authentication** folder
2. Copy the `token` value from the response
3. Go to the environment variables (click the eye icon in top right)
4. Update the `token` value with your JWT token
5. Or use the **Set Variable** feature in Postman's Tests tab (see below)

## API Endpoints

### Authentication (No Auth Required)
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login and get JWT token
- **POST** `/api/auth/request-otp` - Request OTP for MFA
- **POST** `/api/auth/verify-otp` - Verify OTP

### User (Auth Required)
- **GET** `/api/users/me` - Get current user profile
- **PUT** `/api/users/me` - Update user profile
- **POST** `/api/users/me/toggle-mfa` - Toggle MFA

### Family Members (Auth Required)
- **GET** `/api/family-members` - Get all family members
- **GET** `/api/family-members/{id}` - Get family member by ID
- **POST** `/api/family-members` - Create family member
- **PUT** `/api/family-members/{id}` - Update family member
- **DELETE** `/api/family-members/{id}` - Delete family member

### Health Records (Auth Required)
- **GET** `/api/health-records` - Get all health records
- **GET** `/api/health-records?familyMemberId={id}` - Get records by family member
- **GET** `/api/health-records/{id}` - Get health record by ID
- **POST** `/api/health-records` - Create health record
- **PUT** `/api/health-records/{id}` - Update health record
- **DELETE** `/api/health-records/{id}` - Delete health record

### Medications (Auth Required)
- **GET** `/api/medications` - Get all medications
- **GET** `/api/medications?familyMemberId={id}` - Get medications by family member
- **GET** `/api/medications/{id}` - Get medication by ID
- **POST** `/api/medications` - Create medication
- **PUT** `/api/medications/{id}` - Update medication
- **DELETE** `/api/medications/{id}` - Delete medication
- **POST** `/api/medications/{id}/reminders` - Create medication reminder

### Dashboard (Auth Required)
- **GET** `/api/dashboard` - Get dashboard data

### Health Check (No Auth Required)
- **GET** `/api/health` - Health check endpoint

## Quick Start Workflow

1. **Start Backend**: Ensure the backend is running on `http://localhost:8081`

2. **Register/Login**:
   - Use **Register** to create a new account
   - Or use **Login** with existing credentials
   - Copy the `token` from the response

3. **Set Token**:
   - Update the `token` environment variable
   - Or add this to the Login request's Tests tab:
   ```javascript
   if (pm.response.code === 200) {
       const response = pm.response.json();
       pm.environment.set("token", response.token);
   }
   ```

4. **Test APIs**:
   - Create a family member
   - Add health records
   - Add medications
   - Create reminders
   - View dashboard

## Example Request Bodies

### Register
```json
{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
}
```

### Create Family Member
```json
{
    "firstName": "Jane",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "relationship": "Spouse",
    "phoneNumber": "+1234567891",
    "email": "jane@example.com"
}
```

### Create Health Record
```json
{
    "familyMemberId": 1,
    "recordType": "VITAL",
    "title": "Blood Pressure Check",
    "description": "Regular monitoring",
    "value": "120/80",
    "unit": "mmHg",
    "recordedDate": "2025-12-19",
    "doctorName": "Dr. Smith",
    "notes": "Normal range"
}
```

### Create Medication
```json
{
    "familyMemberId": 1,
    "name": "Aspirin",
    "dosage": "100mg",
    "frequency": "DAILY",
    "startDate": "2025-12-01",
    "endDate": "2025-12-31",
    "instructions": "Take with food",
    "prescribedBy": "Dr. Smith"
}
```

### Create Medication Reminder
```json
{
    "reminderTime": "09:00",
    "reminderType": "BOTH",
    "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
}
```

## Notes

- All authenticated endpoints require the `Authorization: Bearer {token}` header
- The token is automatically included in requests when set in the environment
- Replace `{id}` placeholders with actual IDs from your database
- Date format: `YYYY-MM-DD`
- Time format: `HH:mm` (24-hour format)
- Days of week: Use full names (Monday, Tuesday, etc.)

## Troubleshooting

### 401 Unauthorized
- Check if token is set in environment variables
- Verify token hasn't expired
- Re-login to get a new token

### 404 Not Found
- Verify backend is running on the correct port
- Check the `base_url` environment variable
- Ensure the endpoint path is correct

### 400 Bad Request
- Check request body format
- Verify required fields are included
- Check data types match the API specification

