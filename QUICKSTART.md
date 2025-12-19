# MediTrack - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Prerequisites Check

```bash
java -version  # Should be 17+
mvn -version   # Should be 3.6+
node -v        # Should be 16+
psql --version  # PostgreSQL should be 12+
redis-cli ping  # Should return PONG
```

### Step 1: Start Infrastructure (Docker)

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker-compose ps
```

### Step 2: Backend Setup

```bash
cd backend

# Create .env file from example
cp .env.example .env

# Edit .env with your configuration
# At minimum, update:
# - DB_PASSWORD (if different from 'postgres')
# - JWT_SECRET (generate a secure random string)
# - MAIL_USERNAME and MAIL_PASSWORD (for email notifications)

# Build and run
mvn clean install
mvn spring-boot:run
```

Backend will be available at: `http://localhost:8080`

### Step 3: Frontend Setup

```bash
cd frontend

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env

# Install dependencies and start
npm install
npm start
```

Frontend will be available at: `http://localhost:3000`

### Step 4: Test the Application

1. **Register a new account:**

   - Go to `http://localhost:3000/register`
   - Fill in the registration form
   - You'll be automatically logged in

2. **Add a family member:**

   - Click "Add Family Member" on the dashboard
   - Fill in the details

3. **Add a medication:**

   - Navigate to a family member
   - Add a medication with reminder

4. **Test MFA (Optional):**
   - Go to profile settings
   - Enable MFA
   - Logout and login again
   - You'll receive an OTP via email

## 🔧 Configuration Tips

### Email Setup (Gmail)

1. Enable 2-Step Verification
2. Generate an App Password
3. Use the App Password in `MAIL_PASSWORD`

### Twilio Setup (SMS - Optional)

1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token
3. Get a phone number
4. Update `.env` with Twilio credentials

### JWT Secret Generation

```bash
# Generate a secure random string
openssl rand -base64 32
```

## 🐛 Troubleshooting

### Backend won't start

- Check PostgreSQL is running: `docker-compose ps`
- Verify database exists: `psql -U postgres -l | grep meditrack`
- Check Redis is running: `redis-cli ping`

### Frontend can't connect to backend

- Verify backend is running: `curl http://localhost:8080/api/health`
- Check CORS settings in `SecurityConfig.java`
- Verify `REACT_APP_API_URL` in frontend `.env`

### Database migration errors

- Drop and recreate database:
  ```bash
  psql -U postgres -c "DROP DATABASE meditrack;"
  psql -U postgres -c "CREATE DATABASE meditrack;"
  ```
- Restart backend to run migrations

### Email not sending

- Check SMTP credentials
- For Gmail, ensure App Password is used (not regular password)
- Check spam folder

## 📝 Next Steps

1. Read [README.md](./README.md) for detailed documentation
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. Explore API endpoints in the README
4. Customize the application for your needs

## 🎯 Key Features to Try

- ✅ User registration and authentication
- ✅ Family member management
- ✅ Health record tracking
- ✅ Medication scheduling
- ✅ Automated reminders (Email/SMS)
- ✅ Multi-factor authentication

Happy tracking! 🏥
