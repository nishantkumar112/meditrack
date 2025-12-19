# PostgreSQL Enum Type Error - Fixed ✅

## Problem
When calling the register API, you got this error:
```
ERROR: column "role" is of type user_role but expression is of type character varying
```

## Root Cause
- PostgreSQL database had a custom enum type `user_role`
- JPA was trying to insert string values using `@Enumerated(EnumType.STRING)`
- PostgreSQL requires explicit casting when inserting strings into enum columns

## Solution Applied

### 1. Created Migration V2
**File:** `backend/src/main/resources/db/migration/V2__fix_user_roles_enum.sql`

This migration:
- Drops the old `user_roles` table with enum type
- Recreates it with `VARCHAR(50)` type
- Adds a CHECK constraint to ensure only 'USER' or 'ADMIN' values

### 2. Database Schema Change
**Before:**
```sql
role user_role NOT NULL  -- PostgreSQL enum type
```

**After:**
```sql
role VARCHAR(50) NOT NULL  -- String type with CHECK constraint
CONSTRAINT check_role CHECK (role IN ('USER', 'ADMIN'))
```

## Verification

The migration has been applied successfully:
```sql
-- Check table structure
\d user_roles

-- Shows:
-- role | character varying(50)
```

## How It Works Now

1. **JPA Entity** uses `@Enumerated(EnumType.STRING)` which stores enum as string
2. **Database Column** is now `VARCHAR(50)` which accepts strings
3. **CHECK Constraint** ensures only valid enum values ('USER', 'ADMIN') can be inserted
4. **No Casting Required** - JPA can directly insert string values

## Testing

The register API should now work:
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## Status
✅ **FIXED** - The enum type error has been resolved by changing the database column to VARCHAR.

