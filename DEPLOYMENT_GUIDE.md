# 🚀 Free Deployment Guide for MediTrack

This guide will help you deploy MediTrack application completely free using:
- **Frontend**: Vercel or Netlify
- **Backend**: Render or Railway
- **Database**: Supabase (PostgreSQL)

---

## 📋 Prerequisites

1. GitHub account (for hosting code)
2. Accounts on:
   - [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (Frontend)
   - [Render](https://render.com) or [Railway](https://railway.app) (Backend)
   - [Supabase](https://supabase.com) (Database)

---

## 🗄️ Step 1: Set Up Database (Supabase)

### 1.1 Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for free account
3. Create a new project

### 1.2 Get Database Connection Details
1. Go to **Settings** → **Database**
2. Copy the connection string (URI format)
3. Note down:
   - Host
   - Database name
   - Username
   - Password
   - Port (usually 5432)

### 1.3 Run Database Migrations
1. Go to **SQL Editor** in Supabase
2. Copy contents of `backend/src/main/resources/db/migration/V1__create_tables.sql`
3. Run it in SQL Editor
4. Repeat for `V2__fix_user_roles_enum.sql` and `V3__fix_reminder_enums.sql`

**Connection String Format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

---

## 🔧 Step 2: Deploy Backend (Render)

### 2.1 Prepare Backend for Deployment

1. **Update application.yml** (already configured for environment variables)

2. **Create environment variables file** (`.env.example`):
```bash
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=10000
DB_URL=jdbc:postgresql://[HOST]:5432/postgres
DB_USERNAME=postgres
DB_PASSWORD=[PASSWORD]
JWT_SECRET=[GENERATE-32-CHAR-SECRET]
REDIS_HOST=localhost
REDIS_PORT=6379
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=[YOUR-EMAIL]
MAIL_PASSWORD=[APP-PASSWORD]
TWILIO_ACCOUNT_SID=[YOUR-SID]
TWILIO_AUTH_TOKEN=[YOUR-TOKEN]
TWILIO_PHONE_NUMBER=[YOUR-NUMBER]
FRONTEND_URL=https://your-frontend.vercel.app
```

### 2.2 Deploy to Render

#### Option A: Using render.yaml (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/MediTrack.git
   git push -u origin main
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Sign up/login
   - Click **New +** → **Blueprint**
   - Connect your GitHub repository
   - Render will detect `render.yaml` automatically
   - Review and deploy

#### Option B: Manual Setup

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click **New +** → **Web Service**
   - Connect GitHub repository
   - Select `backend` folder

2. **Configure Build Settings**
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`
   - **Environment**: `Java`

3. **Add Environment Variables**
   ```
   SPRING_PROFILES_ACTIVE=prod
   SERVER_PORT=10000
   DB_URL=jdbc:postgresql://[SUPABASE-HOST]:5432/postgres
   DB_USERNAME=postgres
   DB_PASSWORD=[SUPABASE-PASSWORD]
   JWT_SECRET=[GENERATE-RANDOM-32-CHAR-STRING]
   FRONTEND_URL=https://your-frontend.vercel.app
   MAIL_HOST=smtp.gmail.com
   MAIL_USERNAME=[YOUR-EMAIL]
   MAIL_PASSWORD=[GMAIL-APP-PASSWORD]
   TWILIO_ACCOUNT_SID=[OPTIONAL]
   TWILIO_AUTH_TOKEN=[OPTIONAL]
   TWILIO_PHONE_NUMBER=[OPTIONAL]
   ```

4. **Create PostgreSQL Database** (if not using Supabase)
   - In Render dashboard, click **New +** → **PostgreSQL**
   - Copy connection details
   - Update `DB_URL` in environment variables

5. **Deploy**
   - Click **Create Web Service**
   - Wait for build and deployment
   - Note the service URL (e.g., `https://meditrack-backend.onrender.com`)

### 2.3 Alternative: Deploy to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up/login with GitHub**
3. **Create New Project**
4. **Add Service** → **GitHub Repo** → Select your repo
5. **Configure**:
   - Root Directory: `backend`
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -jar target/*.jar`
6. **Add Environment Variables** (same as Render)
7. **Add PostgreSQL** (or use Supabase)
   - Click **+ New** → **Database** → **PostgreSQL**
   - Railway will auto-generate connection variables

---

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Update API URL

1. **Update `frontend/src/services/api.js`**:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend.onrender.com/api';
   ```

### 3.2 Deploy to Vercel

1. **Push frontend code to GitHub** (if separate repo)

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click **Add New Project**
   - Import your repository
   - Select `frontend` folder as root
   - Configure:
     - **Framework Preset**: Create React App
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
     - **Install Command**: `npm install`

3. **Add Environment Variable**:
   - Go to **Settings** → **Environment Variables**
   - Add: `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`

4. **Deploy**
   - Click **Deploy**
   - Wait for build
   - Get your frontend URL (e.g., `https://meditrack.vercel.app`)

### 3.3 Update Backend CORS

1. **Update backend `SecurityConfig.java`** to allow your Vercel domain:
   ```java
   .allowedOrigins("https://your-frontend.vercel.app", "https://your-frontend.netlify.app")
   ```

2. **Redeploy backend**

### 3.4 Alternative: Deploy to Netlify

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/login with GitHub**
3. **Add New Site** → **Import from Git**
4. **Select repository and configure**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
5. **Add Environment Variable**:
   - Go to **Site Settings** → **Environment Variables**
   - Add: `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`
6. **Deploy**

---

## 🔐 Step 4: Generate Secrets

### 4.1 Generate JWT Secret
```bash
# On Linux/Mac
openssl rand -base64 32

# Or use online generator
# https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

### 4.2 Gmail App Password (for email)
1. Go to [Google Account Settings](https://myaccount.google.com)
2. **Security** → **2-Step Verification** (enable if not)
3. **App Passwords** → Generate new app password
4. Use this password in `MAIL_PASSWORD`

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend
```bash
# Health check
curl https://your-backend.onrender.com/actuator/health

# API test
curl https://your-backend.onrender.com/api/health
```

### 5.2 Test Frontend
1. Visit your Vercel/Netlify URL
2. Try to register/login
3. Check browser console for errors

### 5.3 Update Frontend API URL
If frontend is deployed, update the environment variable:
- **Vercel**: Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables

---

## 🔄 Step 6: Continuous Deployment

Both platforms support automatic deployments:
- **Push to main branch** → Auto-deploy
- **Pull requests** → Preview deployments

---

## 📝 Environment Variables Summary

### Backend (Render/Railway)
```
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=10000
DB_URL=jdbc:postgresql://[HOST]:5432/postgres
DB_USERNAME=postgres
DB_PASSWORD=[PASSWORD]
JWT_SECRET=[32-CHAR-SECRET]
FRONTEND_URL=https://your-frontend.vercel.app
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=[EMAIL]
MAIL_PASSWORD=[APP-PASSWORD]
TWILIO_ACCOUNT_SID=[OPTIONAL]
TWILIO_AUTH_TOKEN=[OPTIONAL]
TWILIO_PHONE_NUMBER=[OPTIONAL]
```

### Frontend (Vercel/Netlify)
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Build fails
- **Solution**: Check Java version (should be 17)
- Check Maven build logs

**Problem**: Database connection fails
- **Solution**: Verify database URL format
- Check Supabase connection settings
- Ensure database is accessible from Render/Railway IP

**Problem**: Application crashes on startup
- **Solution**: Check logs in Render/Railway dashboard
- Verify all environment variables are set
- Check JWT_SECRET is set

### Frontend Issues

**Problem**: API calls fail
- **Solution**: Check CORS settings in backend
- Verify `REACT_APP_API_URL` is set correctly
- Check browser console for errors

**Problem**: Build fails
- **Solution**: Check Node version (should be 18+)
- Run `npm install` locally first
- Check for missing dependencies

---

## 💰 Free Tier Limits

### Render
- **Web Services**: 750 hours/month (free tier sleeps after 15 min inactivity)
- **PostgreSQL**: 90 days free trial, then $7/month
- **Solution**: Use Supabase for free PostgreSQL

### Railway
- **$5 free credit/month**
- **PostgreSQL**: Included in free tier

### Vercel
- **Unlimited** deployments
- **100GB bandwidth/month**
- **Perfect for frontend**

### Netlify
- **100GB bandwidth/month**
- **300 build minutes/month**
- **Perfect for frontend**

### Supabase
- **500MB database**
- **2GB bandwidth**
- **50,000 monthly active users**
- **Perfect for small apps**

---

## 🎯 Quick Start Checklist

- [ ] Create Supabase project and get connection string
- [ ] Run database migrations in Supabase SQL Editor
- [ ] Push code to GitHub
- [ ] Deploy backend to Render/Railway
- [ ] Set all backend environment variables
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Set `REACT_APP_API_URL` in frontend
- [ ] Update backend CORS with frontend URL
- [ ] Test registration/login
- [ ] Verify all features work

---

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Supabase Documentation](https://supabase.com/docs)

---

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for frontend errors

---

**Happy Deploying! 🚀**

