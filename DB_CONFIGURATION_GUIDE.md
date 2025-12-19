# Database & Docker Configuration Guide

## 📚 Table of Contents

1. [Docker Concepts](#docker-concepts)
2. [PostgreSQL Configuration](#postgresql-configuration)
3. [Database Connection Concepts](#database-connection-concepts)
4. [Network Architecture](#network-architecture)
5. [Configuration Files Explained](#configuration-files-explained)
6. [Step-by-Step Setup Process](#step-by-step-setup-process)
7. [Debugging Guide](#debugging-guide)
8. [Common Issues & Solutions](#common-issues--solutions)

---

## 🐳 Docker Concepts

### What is Docker?

Docker is a platform that packages applications and their dependencies into **containers** - lightweight, portable units that run consistently across different environments.

### Key Docker Concepts

#### 1. **Container**

- A running instance of an image
- Isolated environment with its own filesystem, network, and processes
- Example: `meditrack-postgres` is a container running PostgreSQL

#### 2. **Image**

- A read-only template used to create containers
- Example: `postgres:15` is an image containing PostgreSQL version 15

#### 3. **Docker Compose**

- Tool for defining and running multi-container Docker applications
- Uses `docker-compose.yml` to configure services
- Manages networking between containers automatically

#### 4. **Volume**

- Persistent storage that survives container restarts
- Example: `postgres_data` stores database files

#### 5. **Network**

- Docker creates a virtual network for containers
- Containers on the same network can communicate by service name
- Port mapping exposes container ports to the host machine

---

## 🗄️ PostgreSQL Configuration

### What is PostgreSQL?

PostgreSQL is a powerful, open-source relational database management system (RDBMS).

### Database Structure

```
PostgreSQL Server (Container)
    └── Database: meditrack
        └── Schema: public
            ├── Table: users
            ├── Table: family_members
            ├── Table: health_records
            ├── Table: medications
            └── Table: medication_reminders
```

### Key PostgreSQL Concepts

#### 1. **Database**

- A collection of schemas, tables, and data
- Our database is named `meditrack`

#### 2. **Schema**

- A namespace within a database
- Default schema is `public`

#### 3. **Table**

- Stores data in rows and columns
- Defined by our Flyway migration: `V1__create_tables.sql`

#### 4. **User/Role**

- `postgres` is the superuser with full privileges

---

## 🔌 Database Connection Concepts

### Connection String Breakdown

```
jdbc:postgresql://localhost:5432/meditrack
│    │           │         │    │    │
│    │           │         │    │    └── Database name
│    │           │         │    └── Port number
│    │           │         └── Hostname/IP
│    │           └── Protocol separator
│    └── Database type
└── Java Database Connectivity
```

### Connection Components

#### 1. **Protocol (JDBC)**

- **JDBC** = Java Database Connectivity
- Standard API for connecting Java applications to databases
- Format: `jdbc:postgresql://`

#### 2. **Hostname**

- **`localhost`**: Connects from your Mac to the Docker container
- **`postgres`**: Service name used inside Docker network
- **`127.0.0.1`**: IP address equivalent of localhost

#### 3. **Port**

- **`5432`**: Default PostgreSQL port
- Mapped from container to host: `"5432:5432"` in docker-compose

#### 4. **Database Name**

- **`meditrack`**: The specific database to connect to

### Connection Flow

```
Backend Application (Mac)
    │
    │ Uses: localhost:5432
    │
    ▼
Docker Port Mapping
    │ Maps: localhost:5432 → container:5432
    │
    ▼
PostgreSQL Container (meditrack-postgres)
    │ Listens on: 5432
    │
    ▼
PostgreSQL Server
    │
    ▼
Database: meditrack
```

---

## 🌐 Network Architecture

### Docker Network Types

#### 1. **Bridge Network (Default)**

- Created automatically by Docker Compose
- Containers can communicate using service names
- Example: `postgres` service name resolves to the container IP

#### 2. **Port Mapping**

- Exposes container ports to host machine
- Format: `"HOST_PORT:CONTAINER_PORT"`
- Example: `"5432:5432"` means:
  - Host port 5432 → Container port 5432
  - Accessible from Mac at `localhost:5432`

### Network Communication

```
┌─────────────────────────────────────────┐
│         Your Mac (Host Machine)         │
│                                          │
│  ┌──────────────┐                       │
│  │   Backend    │                       │
│  │  (Spring)    │                       │
│  └──────┬───────┘                       │
│         │ localhost:5432                │
│         │                               │
└─────────┼───────────────────────────────┘
          │
          │ Port Mapping
          │
┌─────────▼───────────────────────────────┐
│      Docker Network (Bridge)             │
│                                          │
│  ┌──────────────┐    ┌──────────────┐  │
│  │   pgAdmin    │    │  PostgreSQL  │  │
│  │  (port 5050) │    │  (port 5432) │  │
│  └──────┬───────┘    └──────┬───────┘  │
│         │                    │          │
│         │ Uses: postgres:5432│          │
│         └────────────────────┘          │
│         (Service name resolution)       │
└─────────────────────────────────────────┘
```

### Why Different Hostnames?

| Component                | Location | Hostname    | Why                       |
| ------------------------ | -------- | ----------- | ------------------------- |
| **Backend**              | Mac      | `localhost` | Connects via port mapping |
| **pgAdmin (Docker)**     | Docker   | `postgres`  | Uses Docker service name  |
| **pgAdmin (Standalone)** | Mac      | `localhost` | Connects via port mapping |

---

## 📝 Configuration Files Explained

### 1. docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:15 # PostgreSQL version 15 image
    container_name: meditrack-postgres # Container name
    environment:
      POSTGRES_DB: meditrack # Creates database on startup
      POSTGRES_USER: postgres # Database user
      POSTGRES_PASSWORD: postgres # Database password
    ports:
      - '5432:5432' # Host:Container port mapping
    volumes:
      - postgres_data:/var/lib/postgresql/data # Persistent storage
```

**Key Points:**

- `POSTGRES_DB`: Automatically creates the database when container starts
- `ports`: Makes PostgreSQL accessible from Mac
- `volumes`: Data persists even if container is deleted

### 2. application.yml

```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/meditrack}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}
```

**Key Points:**

- `${DB_URL:default}`: Uses environment variable or default value
- Reads from `.env` file or system environment variables
- Connection string specifies exact database to connect to

### 3. .env File

```bash
DB_URL=jdbc:postgresql://localhost:5432/meditrack
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

**Key Points:**

- Environment variables loaded by Spring Boot
- Overrides defaults in `application.yml`
- Keeps sensitive data out of code

---

## 🔧 Step-by-Step Setup Process

### Step 1: Docker Compose Setup

```bash
docker-compose up -d
```

**What happens:**

1. Docker reads `docker-compose.yml`
2. Pulls images if not present (`postgres:15`, `redis:7-alpine`)
3. Creates network for containers
4. Creates volumes for data persistence
5. Starts containers in background (`-d` flag)

**Creates:**

- `meditrack-postgres` container
- `meditrack-redis` container
- `meditrack-pgadmin` container (if configured)
- Network: `meditrack_default`
- Volumes: `postgres_data`, `redis_data`

### Step 2: Database Creation

**Automatic (via docker-compose.yml):**

```yaml
environment:
  POSTGRES_DB: meditrack # Creates database automatically
```

**Manual (if needed):**

```bash
docker exec meditrack-postgres psql -U postgres -c "CREATE DATABASE meditrack;"
```

### Step 3: Table Creation (Flyway)

When backend starts:

1. Spring Boot connects to database
2. Flyway checks `db/migration/` folder
3. Executes `V1__create_tables.sql`
4. Creates all tables, indexes, triggers

**Flyway Migration:**

- File: `V1__create_tables.sql`
- Version: `V1` (Flyway versioning)
- Runs automatically on first backend start

### Step 4: Backend Connection

```bash
cd backend
mvn spring-boot:run
```

**Connection Process:**

1. Spring Boot reads `application.yml`
2. Loads environment variables from `.env`
3. Creates connection pool (HikariCP)
4. Tests connection to PostgreSQL
5. Runs Flyway migrations
6. Starts application

---

## 🐛 Debugging Guide

### Debugging Checklist

#### 1. **Verify Docker Containers are Running**

```bash
docker-compose ps
```

**Expected Output:**

```
NAME                 STATUS
meditrack-postgres  Up (healthy)
meditrack-redis     Up (healthy)
```

**If not running:**

```bash
docker-compose up -d
docker-compose logs postgres  # Check logs
```

#### 2. **Verify Database Exists**

```bash
docker exec meditrack-postgres psql -U postgres -l
```

**Expected Output:**

```
   Name    |  Owner   | Encoding
-----------+----------+----------
 meditrack | postgres | UTF8
```

**If database doesn't exist:**

```bash
docker exec meditrack-postgres psql -U postgres -c "CREATE DATABASE meditrack;"
```

#### 3. **Test Connection from Mac**

```bash
# Test if port is accessible
nc -z localhost 5432 && echo "Port open" || echo "Port closed"

# Test connection with psql (if installed)
psql -h localhost -p 5432 -U postgres -d meditrack -c "SELECT 1;"
```

**If connection fails:**

- Check port mapping: `docker port meditrack-postgres`
- Verify container is running: `docker ps`

#### 4. **Check Connection String**

```bash
cd backend
cat .env | grep DB_URL
```

**Should be:**

```
DB_URL=jdbc:postgresql://localhost:5432/meditrack
```

**Common mistakes:**

- ❌ `jdbc:postgresql://postgres:5432/meditrack` (only works inside Docker)
- ✅ `jdbc:postgresql://localhost:5432/meditrack` (works from Mac)

#### 5. **Verify Environment Variables**

```bash
cd backend
cat .env
```

**Required variables:**

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

#### 6. **Check PostgreSQL Logs**

```bash
docker-compose logs postgres
```

**Look for:**

- Connection attempts
- Authentication errors
- Database creation messages

#### 7. **Test Database Connection from Container**

```bash
# Test from inside PostgreSQL container
docker exec meditrack-postgres psql -U postgres -d meditrack -c "SELECT version();"

# List all databases
docker exec meditrack-postgres psql -U postgres -l

# Check tables
docker exec meditrack-postgres psql -U postgres -d meditrack -c "\dt"
```

#### 8. **Check Network Connectivity**

```bash
# From pgAdmin container to postgres
docker exec meditrack-pgadmin ping -c 2 postgres

# Check if containers are on same network
docker network inspect meditrack_default
```

---

## 🔍 Common Issues & Solutions

### Issue 1: "Database does not exist"

**Symptoms:**

```
FATAL: database "meditrack" does not exist
```

**Causes:**

1. Database wasn't created
2. Wrong database name in connection string
3. Connecting to wrong PostgreSQL instance

**Solutions:**

```bash
# 1. Check if database exists
docker exec meditrack-postgres psql -U postgres -l | grep meditrack

# 2. Create database if missing
docker exec meditrack-postgres psql -U postgres -c "CREATE DATABASE meditrack;"

# 3. Verify connection string
cat backend/.env | grep DB_URL
# Should be: jdbc:postgresql://localhost:5432/meditrack
```

### Issue 2: "Connection refused"

**Symptoms:**

```
Connection to localhost:5432 refused
```

**Causes:**

1. PostgreSQL container not running
2. Port not mapped correctly
3. Firewall blocking port

**Solutions:**

```bash
# 1. Check container status
docker-compose ps

# 2. Restart containers
docker-compose restart postgres

# 3. Check port mapping
docker port meditrack-postgres
# Should show: 0.0.0.0:5432->5432/tcp

# 4. Test port accessibility
nc -z localhost 5432
```

### Issue 3: "Authentication failed"

**Symptoms:**

```
FATAL: password authentication failed for user "postgres"
```

**Causes:**

1. Wrong password in `.env`
2. Password changed in container
3. User doesn't exist

**Solutions:**

```bash
# 1. Verify password in .env matches docker-compose.yml
cat backend/.env | grep DB_PASSWORD
cat docker-compose.yml | grep POSTGRES_PASSWORD

# 2. Reset password (if needed)
docker exec -it meditrack-postgres psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

### Issue 4: "Host not found" (pgAdmin)

**Symptoms:**

```
failed to resolve host 'postgres'
```

**Causes:**

- Using standalone pgAdmin4 with Docker hostname
- Containers on different networks

**Solutions:**

- **Standalone pgAdmin4**: Use `localhost` as hostname
- **Docker pgAdmin4**: Use `postgres` as hostname

### Issue 5: "Connection timeout"

**Symptoms:**

```
Connection timed out after 30 seconds
```

**Causes:**

1. PostgreSQL not ready yet
2. Network issues
3. Connection pool exhausted

**Solutions:**

```bash
# 1. Check PostgreSQL is healthy
docker-compose ps
# Look for "healthy" status

# 2. Check logs for startup issues
docker-compose logs postgres | tail -20

# 3. Increase connection timeout in application.yml
# connection-timeout: 60000  # 60 seconds
```

### Issue 6: "Tables don't exist"

**Symptoms:**

```
Table "users" does not exist
```

**Causes:**

1. Flyway migrations didn't run
2. Wrong schema
3. Database connection issue

**Solutions:**

```bash
# 1. Check if tables exist
docker exec meditrack-postgres psql -U postgres -d meditrack -c "\dt"

# 2. Check Flyway migration status
# Look in backend logs for Flyway messages

# 3. Manually run migration (if needed)
docker exec -i meditrack-postgres psql -U postgres -d meditrack < backend/src/main/resources/db/migration/V1__create_tables.sql
```

---

## 🔬 Advanced Debugging

### Check Connection Pool Status

Add to `application.yml`:

```yaml
logging:
  level:
    com.zaxxer.hikari: DEBUG
```

This shows connection pool activity in logs.

### Monitor Database Connections

```bash
# See active connections
docker exec meditrack-postgres psql -U postgres -d meditrack -c "
SELECT
    datname,
    usename,
    application_name,
    client_addr,
    state
FROM pg_stat_activity
WHERE datname = 'meditrack';
"
```

### Test Connection with Different Tools

```bash
# Using psql
psql -h localhost -p 5432 -U postgres -d meditrack

# Using Docker exec
docker exec -it meditrack-postgres psql -U postgres -d meditrack

# Using telnet (test port only)
telnet localhost 5432
```

### View Real-time Logs

```bash
# PostgreSQL logs
docker-compose logs -f postgres

# Backend logs (when running)
# Check console output for connection messages
```

---

## 📊 Connection Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Backend Startup                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Read application.yml                                     │
│     - Loads datasource configuration                        │
│     - Reads environment variables from .env                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Create HikariCP Connection Pool                        │
│     - Connection URL: jdbc:postgresql://localhost:5432/... │
│     - Username: postgres                                     │
│     - Password: postgres                                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Attempt Connection                                      │
│     - TCP connection to localhost:5432                      │
│     - Docker port mapping forwards to container             │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  4. PostgreSQL Authentication                               │
│     - Username: postgres                                     │
│     - Password: postgres                                     │
│     - Database: meditrack                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Flyway Migration                                        │
│     - Checks migration history                              │
│     - Runs V1__create_tables.sql if not run                 │
│     - Creates tables, indexes, triggers                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Application Ready                                       │
│     - Connection pool established                          │
│     - Database schema ready                                 │
│     - Spring Boot application started                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Reference

### Essential Commands

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres

# Connect to database
docker exec -it meditrack-postgres psql -U postgres -d meditrack

# List databases
docker exec meditrack-postgres psql -U postgres -l

# List tables
docker exec meditrack-postgres psql -U postgres -d meditrack -c "\dt"

# Test connection
nc -z localhost 5432
```

### Configuration Files

| File                 | Purpose               | Key Settings                |
| -------------------- | --------------------- | --------------------------- |
| `docker-compose.yml` | Docker services       | Ports, volumes, environment |
| `application.yml`    | Spring Boot config    | Datasource, Flyway          |
| `.env`               | Environment variables | DB_URL, credentials         |

### Connection Strings

| Context              | Hostname    | Example                                      |
| -------------------- | ----------- | -------------------------------------------- |
| Backend (Mac)        | `localhost` | `jdbc:postgresql://localhost:5432/meditrack` |
| pgAdmin (Docker)     | `postgres`  | `postgres:5432`                              |
| pgAdmin (Standalone) | `localhost` | `localhost:5432`                             |

---

## ✅ Verification Checklist

Before starting backend, verify:

- [ ] Docker containers running: `docker-compose ps`
- [ ] Database exists: `docker exec meditrack-postgres psql -U postgres -l`
- [ ] Port accessible: `nc -z localhost 5432`
- [ ] `.env` file exists: `cat backend/.env`
- [ ] Connection string correct: `jdbc:postgresql://localhost:5432/meditrack`
- [ ] Credentials match: Username/password in `.env` match docker-compose.yml

---

This guide should help you understand and debug any database configuration issues! 🎓
