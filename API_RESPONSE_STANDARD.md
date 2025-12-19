# API Response Standardization

## Overview

All API endpoints now return a standardized response format for consistent error handling and success responses across the application.

## Standard Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2025-12-19T10:00:00"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": "Error message",
  "status": 400,
  "timestamp": "2025-12-19T10:00:00",
  "errors": {
    "fieldName": "Validation error message"
  }
}
```

## HTTP Status Codes

- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST requests (create operations)
- **400 Bad Request**: Validation errors, bad input
- **401 Unauthorized**: Authentication required or failed
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the request was successful |
| `message` | string | Human-readable message about the operation |
| `data` | object/array | The actual response data (only present on success) |
| `timestamp` | string | ISO 8601 timestamp of the response |
| `status` | integer | HTTP status code (only present on errors) |
| `error` | string | Error message (only present on errors) |
| `errors` | object | Field-specific validation errors (only present on validation errors) |

## Examples

### Success - Get All Medications

**Request:**
```
GET /api/medications
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Medications retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Aspirin",
      "dosage": "100mg",
      ...
    }
  ],
  "timestamp": "2025-12-19T10:00:00"
}
```

### Success - Create Medication

**Request:**
```
POST /api/medications
Authorization: Bearer {token}
Content-Type: application/json

{
  "familyMemberId": 1,
  "name": "Aspirin",
  "dosage": "100mg",
  ...
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Medication created successfully",
  "data": {
    "id": 1,
    "name": "Aspirin",
    "dosage": "100mg",
    ...
  },
  "timestamp": "2025-12-19T10:00:00"
}
```

### Error - Validation Failed

**Request:**
```
POST /api/medications
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "",
  "dosage": "100mg"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Validation failed",
  "status": 400,
  "timestamp": "2025-12-19T10:00:00",
  "errors": {
    "name": "Medication name is required",
    "familyMemberId": "Family member is required"
  }
}
```

### Error - Resource Not Found

**Request:**
```
GET /api/medications/999
Authorization: Bearer {token}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Medication not found",
  "error": "Medication not found",
  "status": 404,
  "timestamp": "2025-12-19T10:00:00"
}
```

### Error - Unauthorized

**Request:**
```
GET /api/medications
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "status": 401,
  "timestamp": "2025-12-19T10:00:00"
}
```

## Frontend Handling

The frontend API interceptor automatically:
1. Extracts `data` from successful responses
2. Handles error responses with proper error messages
3. Redirects to login on 401 errors
4. Maintains backward compatibility

### Usage in Frontend

```javascript
// Success response - data is automatically extracted
const response = await medicationAPI.getAll();
console.log(response.data); // Array of medications

// Error handling
try {
  await medicationAPI.create(data);
} catch (error) {
  // error.response.data.message contains the error message
  // error.response.data.errors contains validation errors (if any)
  console.error(error.response.data.message);
}
```

## Updated Controllers

All controllers now return `ApiResponse<T>`:
- `AuthController`
- `UserController`
- `FamilyMemberController`
- `HealthRecordController`
- `MedicationController`
- `DashboardController`
- `SuggestionController`
- `HealthController`

## Exception Handling

The `GlobalExceptionHandler` now returns standardized error responses:
- `ResourceNotFoundException` → 404
- `BadRequestException` → 400
- `UnauthorizedException` → 401
- `MethodArgumentNotValidException` → 400 (with validation errors)
- `Exception` → 500

## Benefits

1. **Consistency**: All endpoints follow the same response format
2. **Error Handling**: Standardized error messages and codes
3. **Frontend Integration**: Easier to handle responses in the frontend
4. **Debugging**: Clear error messages with timestamps
5. **Validation**: Structured validation error responses

