# pgAdmin4 Setup Guide for MediTrack

## Option 1: Using pgAdmin4 in Docker (Recommended)

### Step 1: Start pgAdmin4 Container

The `docker-compose.yml` already includes pgAdmin4. Just restart your containers:

```bash
docker-compose up -d
```

pgAdmin4 will be available at: **http://localhost:5050**

### Step 2: Login to pgAdmin4

- **Email**: `admin@meditrack.com`
- **Password**: `admin`

### Step 3: Add Server Connection

1. Right-click on **"Servers"** in the left panel
2. Select **"Register" → "Server"**

3. In the **"General"** tab:
   - **Name**: `MediTrack Database` (or any name you prefer)

4. In the **"Connection"** tab:
   - **Host name/address**: `postgres` (use the Docker service name)
   - **Port**: `5432`
   - **Maintenance database**: `meditrack`
   - **Username**: `postgres`
   - **Password**: `postgres`
   - ✅ Check **"Save password"** (optional)

5. Click **"Save"**

### Step 4: Access the Database

- Expand **"Servers" → "MediTrack Database" → "Databases" → "meditrack"**
- You can now browse tables, run queries, etc.

---

## Option 2: Using Standalone pgAdmin4 (If installed locally)

### Step 1: Install pgAdmin4

Download from: https://www.pgadmin.org/download/

### Step 2: Add Server Connection

1. Open pgAdmin4
2. Right-click on **"Servers"** → **"Register" → "Server"**

3. In the **"General"** tab:
   - **Name**: `MediTrack Database`

4. In the **"Connection"** tab:
   - **Host name/address**: `localhost` (or `127.0.0.1`)
   - **Port**: `5432`
   - **Maintenance database**: `meditrack`
   - **Username**: `postgres`
   - **Password**: `postgres`
   - ✅ Check **"Save password"**

5. Click **"Save"**

---

## Running SQL Queries

### Method 1: Using Query Tool

1. Right-click on the `meditrack` database
2. Select **"Query Tool"**
3. Type your SQL query
4. Click **"Execute"** (or press F5)

### Method 2: Using SQL Editor

1. Expand **"meditrack" → "Schemas" → "public"**
2. Right-click on any table → **"View/Edit Data" → "All Rows"**
3. Use the SQL tab to write custom queries

---

## Quick Test Query

Try this to verify the connection:

```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check users table
SELECT * FROM users LIMIT 5;

-- Check family members
SELECT * FROM family_members LIMIT 5;
```

---

## Connection Details Summary

| Setting | Value |
|---------|-------|
| **Host** | `postgres` (Docker) or `localhost` (Standalone) |
| **Port** | `5432` |
| **Database** | `meditrack` |
| **Username** | `postgres` |
| **Password** | `postgres` |

---

## Troubleshooting

### Can't connect from standalone pgAdmin4

- Make sure PostgreSQL container is running: `docker-compose ps`
- Verify port 5432 is accessible: `docker port meditrack-postgres`
- Try using `127.0.0.1` instead of `localhost`

### Can't connect from Docker pgAdmin4

- Use `postgres` as hostname (Docker service name)
- Make sure both containers are on the same Docker network
- Check if postgres container is healthy: `docker-compose ps`

### Database not found

- The database is created automatically by Flyway migrations when the backend starts
- If it doesn't exist, start the backend once: `cd backend && mvn spring-boot:run`
- Or create it manually:
  ```sql
  CREATE DATABASE meditrack;
  ```

---

## Useful SQL Queries for MediTrack

### View all users
```sql
SELECT id, email, first_name, last_name, enabled, mfa_enabled, created_at 
FROM users;
```

### View family members with user info
```sql
SELECT 
    fm.id,
    fm.first_name,
    fm.last_name,
    fm.relationship,
    u.email as user_email
FROM family_members fm
JOIN users u ON fm.user_id = u.id;
```

### View medications with reminders
```sql
SELECT 
    m.name,
    m.dosage,
    m.frequency,
    mr.reminder_time,
    mr.reminder_type,
    mr.status
FROM medications m
LEFT JOIN medication_reminders mr ON m.id = mr.medication_id;
```

### View health records
```sql
SELECT 
    hr.record_type,
    hr.title,
    hr.recorded_date,
    fm.first_name || ' ' || fm.last_name as family_member
FROM health_records hr
JOIN family_members fm ON hr.family_member_id = fm.id
ORDER BY hr.recorded_date DESC;
```

---

Happy querying! 🗄️

