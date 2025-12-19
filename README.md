# MediTrack - Personal Health Monitoring Application

A full-stack health management platform built with Spring Boot and React.js that allows users to manage family health profiles, medication schedules, and receive automated health notifications.

## 🏗️ Architecture

MediTrack follows a layered architecture:

- **Frontend**: React.js with Context API for state management
- **Backend**: Spring Boot with RESTful APIs
- **Database**: PostgreSQL for primary data storage
- **Cache**: Redis for OTP storage and session management
- **Notifications**: Twilio (SMS) and SMTP (Email)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design.

## 🚀 Features

### Authentication & Security
- JWT-based authentication
- Multi-Factor Authentication (MFA) with OTP
- Role-based access control (USER, ADMIN)
- Secure password hashing with BCrypt

### User & Family Management
- User registration and profile management
- Family member creation and management
- Relationship tracking

### Health Data Management
- Health records (conditions, vitals, allergies, prescriptions)
- Medical history tracking
- Doctor information storage

### Medication Reminder System
- Medication scheduling
- Automated reminders via SMS and Email
- Configurable reminder times
- Daily/weekly reminder patterns

## 📋 Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 16+
- PostgreSQL 12+
- Redis 6+

## 🔧 Setup Instructions

### Backend Setup

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Configure database:**
   - Create a PostgreSQL database named `meditrack`
   - Update `application.yml` with your database credentials

3. **Configure Redis:**
   - Start Redis server
   - Update Redis connection in `application.yml`

4. **Configure Email (SMTP):**
   - Update `application.yml` with your SMTP credentials
   - For Gmail, use an App Password

5. **Configure Twilio (Optional for SMS):**
   - Sign up at [Twilio](https://www.twilio.com/)
   - Get Account SID, Auth Token, and Phone Number
   - Update `application.yml` with Twilio credentials

6. **Set environment variables:**
   ```bash
   export JWT_SECRET=your-256-bit-secret-key-change-this-in-production
   export DB_URL=jdbc:postgresql://localhost:5432/meditrack
   export DB_USERNAME=postgres
   export DB_PASSWORD=postgres
   export REDIS_HOST=localhost
   export REDIS_PORT=6379
   export MAIL_USERNAME=your-email@gmail.com
   export MAIL_PASSWORD=your-app-password
   export TWILIO_ACCOUNT_SID=your-account-sid
   export TWILIO_AUTH_TOKEN=your-auth-token
   export TWILIO_PHONE_NUMBER=your-twilio-number
   ```

7. **Build and run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL:**
   - Create `.env` file:
     ```
     REACT_APP_API_URL=http://localhost:8080/api
     ```

4. **Start development server:**
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Request OTP
```
POST /api/auth/request-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Verify OTP
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

### User Endpoints

#### Get Current User
```
GET /api/users/me
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/users/me?firstName=John&lastName=Doe&phoneNumber=+1234567890
Authorization: Bearer <token>
```

### Family Member Endpoints

#### Get All Family Members
```
GET /api/family-members
Authorization: Bearer <token>
```

#### Create Family Member
```
POST /api/family-members
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "relationship": "Spouse",
  "phoneNumber": "+1234567890",
  "email": "jane@example.com"
}
```

### Health Record Endpoints

#### Get Health Records
```
GET /api/health-records?familyMemberId=1
Authorization: Bearer <token>
```

#### Create Health Record
```
POST /api/health-records
Authorization: Bearer <token>
Content-Type: application/json

{
  "familyMemberId": 1,
  "recordType": "CONDITION",
  "title": "Diabetes Type 2",
  "description": "Diagnosed in 2020",
  "recordedDate": "2020-01-15",
  "doctorName": "Dr. Smith"
}
```

### Medication Endpoints

#### Get Medications
```
GET /api/medications?familyMemberId=1
Authorization: Bearer <token>
```

#### Create Medication
```
POST /api/medications
Authorization: Bearer <token>
Content-Type: application/json

{
  "familyMemberId": 1,
  "name": "Metformin",
  "dosage": "500mg",
  "frequency": "TWICE_DAILY",
  "startDate": "2024-01-01",
  "instructions": "Take with food"
}
```

#### Create Reminder
```
POST /api/medications/{medicationId}/reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "reminderTime": "09:00:00",
  "daysOfWeek": [1, 2, 3, 4, 5],
  "reminderType": "BOTH"
}
```

## 🔐 Security Flow

1. **Registration**: User registers → Account created → JWT token issued
2. **Login**: User logs in → JWT token issued (or MFA required)
3. **MFA**: If enabled → OTP sent via Email/SMS → User verifies → JWT token issued
4. **API Access**: JWT token validated → Role checked → Request processed

## ⏰ Reminder Workflow

1. **Scheduling**: User creates medication reminder → Stored in database
2. **Scheduler**: Spring Scheduler checks for due reminders every minute
3. **Notification**: ReminderService sends SMS (Twilio) or Email (SMTP)
4. **Tracking**: Reminder status updated (sent, missed, completed)

## 🗄️ Database Schema

The application uses the following main tables:
- `users` - User accounts
- `user_roles` - User roles
- `family_members` - Linked family members
- `health_records` - Medical history and vitals
- `medications` - Medication information
- `medication_reminders` - Scheduled reminders

See `backend/src/main/resources/db/migration/V1__create_tables.sql` for full schema.

## 🚀 Deployment

### Free Deployment Guide

Deploy MediTrack completely free using:
- **Frontend**: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend**: [Render](https://render.com) or [Railway](https://railway.app)
- **Database**: [Supabase](https://supabase.com) (Free PostgreSQL)

**Quick Start**: See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for 5-minute deployment guide.

**Detailed Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.

**Checklist**: Use [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) to ensure everything is set up correctly.

### Deployment Files

- `backend/Dockerfile` - Docker configuration for backend
- `backend/render.yaml` - Render deployment configuration
- `backend/railway.json` - Railway deployment configuration
- `frontend/vercel.json` - Vercel deployment configuration
- `frontend/netlify.toml` - Netlify deployment configuration

## 🐳 Docker Setup (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: meditrack
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

Run with:
```bash
docker-compose up -d
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Environment Variables

See `.env.example` files in respective directories for required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions, please open an issue on GitHub.

