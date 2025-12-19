# MediTrack - System Architecture

## Overview

MediTrack is a full-stack health monitoring application built with Spring Boot (backend) and React.js (frontend), designed to help users manage family health profiles, medication schedules, and receive automated health notifications.

## System Architecture

```
┌─────────────────┐
│   React.js      │
│   Frontend      │
└────────┬────────┘
         │ HTTPS/REST API
         │
┌────────▼─────────────────────────────────────┐
│         Spring Boot Backend                  │
│  ┌──────────────────────────────────────┐   │
│  │  Controllers (REST APIs)              │   │
│  └──────────────┬───────────────────────┘   │
│                 │                            │
│  ┌──────────────▼───────────────────────┐   │
│  │  Services (Business Logic)           │   │
│  │  - AuthService                       │   │
│  │  - UserService                       │   │
│  │  - HealthService                     │   │
│  │  - MedicationService                 │   │
│  │  - ReminderService                   │   │
│  └──────────────┬───────────────────────┘   │
│                 │                            │
│  ┌──────────────▼───────────────────────┐   │
│  │  Repositories (Data Access)          │   │
│  └──────────────┬───────────────────────┘   │
└─────────────────┼───────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
┌────────▼────────┐ ┌─────▼──────┐
│   PostgreSQL    │ │   Redis    │
│   (Primary DB)  │ │  (Cache)   │
└─────────────────┘ └────────────┘
                           │
                  ┌────────┴────────┐
                  │                 │
         ┌────────▼────────┐ ┌─────▼──────┐
         │   Twilio SMS    │ │   SMTP     │
         │   (Notifications)│ │  (Email)   │
         └─────────────────┘ └────────────┘
```

## Technology Stack

### Backend

- **Spring Boot 3.x** - Main framework
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based authentication
- **Spring Data JPA** - Database access
- **PostgreSQL** - Primary database
- **Redis** - Caching & OTP storage
- **Twilio** - SMS notifications
- **Spring Mail** - Email notifications
- **Spring Scheduler** - Reminder scheduling

### Frontend

- **React.js 18+** - UI framework
- **Axios** - HTTP client
- **React Router** - Routing
- **Context API** - State management
- **TailwindCSS** - Styling

## Database Schema

### Core Entities

1. **User** - Main user accounts
2. **FamilyMember** - Linked family members
3. **HealthRecord** - Medical history and vitals
4. **Medication** - Medication information
5. **MedicationReminder** - Scheduled reminders
6. **UserRole** - Role-based access control

## Security Flow

1. **Registration**: User registers → Email verification → Account created
2. **Login**: User logs in → JWT token issued
3. **MFA**: For sensitive operations → OTP sent → Verified → Access granted
4. **API Access**: JWT token validated → Role checked → Request processed

## Reminder Workflow

1. **Scheduling**: User creates medication reminder → Stored in DB
2. **Scheduler**: Spring Scheduler checks for due reminders every minute
3. **Notification**: ReminderService sends SMS (Twilio) or Email (SMTP)
4. **Tracking**: Reminder status updated (sent, missed, completed)

## API Flow

### Authentication Flow

```
POST /api/auth/register → UserService → UserRepository → JWT Token
POST /api/auth/login → AuthService → JWT Token
POST /api/auth/verify-otp → AuthService → Redis (OTP check) → MFA verified
```

### Health Data Flow

```
GET /api/health/records → HealthService → HealthRecordRepository → Response
POST /api/health/records → HealthService → Validation → Save → Response
```

### Reminder Flow

```
POST /api/medications/reminders → MedicationService → Save → Schedule
Scheduler (Every minute) → ReminderService → Check due → Send notification
```

## Project Structure

```
MediTrack/
├── backend/
│   ├── src/main/java/com/meditrack/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── service/         # Business logic
│   │   ├── security/        # Security configuration
│   │   ├── exception/       # Exception handling
│   │   └── util/            # Utility classes
│   ├── src/main/resources/
│   │   ├── application.yml  # Configuration
│   │   └── db/migration/    # Database migrations
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Context providers
│   │   ├── services/        # API services
│   │   ├── utils/           # Utilities
│   │   └── App.js
│   └── package.json
├── docker-compose.yml       # Docker setup
└── README.md
```
