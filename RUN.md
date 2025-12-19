# 🚀 How to Run MediTrack

## Quick Start (Step-by-Step)

### Step 1: Start Infrastructure Services

**Option A: Using Docker (Recommended)**
```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify they're running
docker-compose ps
```

**Option B: Without Docker (Manual Setup)**
```bash
# Start PostgreSQL (if installed locally)
# On macOS with Homebrew:
brew services start postgresql@15

# Start Redis (if installed locally)
# On macOS with Homebrew:
brew services start redis

# Or use your system's service manager
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Create .env file from example
cp .env.example .env

# Generate a JWT secret (run this command)
openssl rand -base64 32

# Edit .env file and update at minimum:
# - JWT_SECRET=<paste the generated secret>
# - DB_PASSWORD (if different from 'postgres')
# - MAIL_USERNAME and MAIL_PASSWORD (optional, for email features)

# Build the project
mvn clean install

# Run the backend
mvn spring-boot:run
```

**Backend will start on:** `http://localhost:8080`

**Verify it's running:**
```bash
curl http://localhost:8080/api/health
# Should return: {"status":"UP"}
```

### Step 3: Setup Frontend (in a NEW terminal)

```bash
# Navigate to frontend directory
cd frontend

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env

# Install dependencies (first time only)
npm install

# Start the development server
npm start
```

**Frontend will start on:** `http://localhost:3000`

The browser should automatically open. If not, navigate to `http://localhost:3000`

### Step 4: Test the Application

1. **Register a new account:**
   - Go to `http://localhost:3000/register`
   - Fill in: First Name, Last Name, Email, Password
   - Click "Register"
   - You'll be automatically logged in and redirected to dashboard

2. **Explore the dashboard:**
   - You'll see the main dashboard
   - Click "Add Family Member" to add a family member

3. **Add health data:**
   - Navigate to a family member
   - Add health records and medications

## 🛠️ Running Commands Summary

### Terminal 1: Infrastructure
```bash
docker-compose up -d
```

### Terminal 2: Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your settings
mvn spring-boot:run
```

### Terminal 3: Frontend
```bash
cd frontend
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env
npm install  # First time only
npm start
```

## ⚙️ Configuration Checklist

Before running, ensure:

- [ ] PostgreSQL is running and accessible
- [ ] Redis is running and accessible
- [ ] Backend `.env` file is created and configured
- [ ] Frontend `.env` file is created
- [ ] JWT_SECRET is set in backend `.env`

## 🐛 Common Issues

### "Connection refused" errors
- Make sure PostgreSQL and Redis are running
- Check ports 5432 (PostgreSQL) and 6379 (Redis) are available

### Backend won't start
- Check database connection in `.env`
- Verify PostgreSQL is running: `psql -U postgres -c "SELECT 1;"`
- Check Redis: `redis-cli ping`

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:8080/api/health`
- Check `REACT_APP_API_URL` in frontend `.env`
- Make sure backend CORS is configured (already done in code)

### Port already in use
- Backend: Change `SERVER_PORT` in `.env` or `application.yml`
- Frontend: React will prompt to use a different port

## 📝 Notes

- **Email notifications**: Optional. App works without email setup, but MFA and reminders won't send emails
- **SMS notifications**: Optional. Requires Twilio account setup
- **Database**: Will be created automatically on first run via Flyway migrations

## 🎯 Next Steps After Running

1. Register your first account
2. Add family members
3. Add health records
4. Schedule medications with reminders
5. Test MFA (enable in profile settings)

Happy tracking! 🏥

