# ⚡ Quick Deploy Guide

## 🚀 Fastest Way to Deploy (5 minutes)

### Step 1: Database (2 min)
1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create new project → Wait for setup
3. Go to **SQL Editor** → Run these files in order:
   - `backend/src/main/resources/db/migration/V1__create_tables.sql`
   - `backend/src/main/resources/db/migration/V2__fix_user_roles_enum.sql`
   - `backend/src/main/resources/db/migration/V3__fix_reminder_enums.sql`
4. Go to **Settings** → **Database** → Copy connection string

### Step 2: Backend (2 min)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → Sign up
3. **New +** → **Web Service** → Connect GitHub
4. Select `backend` folder
5. **Build**: `mvn clean package -DskipTests`
6. **Start**: `java -jar target/*.jar`
7. **Environment Variables**:
   ```
   SPRING_PROFILES_ACTIVE=prod
   SERVER_PORT=10000
   DB_URL=[SUPABASE-CONNECTION-STRING]
   JWT_SECRET=[GENERATE-32-CHAR-RANDOM]
   FRONTEND_URL=[WILL-UPDATE-AFTER-FRONTEND-DEPLOY]
   CORS_ALLOWED_ORIGINS=[WILL-UPDATE-AFTER-FRONTEND-DEPLOY]
   ```
8. Deploy → Copy backend URL

### Step 3: Frontend (1 min)
1. Go to [vercel.com](https://vercel.com) → Sign up
2. **Add New Project** → Connect GitHub
3. Select `frontend` folder
4. **Environment Variable**:
   ```
   REACT_APP_API_URL=[YOUR-BACKEND-URL]/api
   ```
5. Deploy → Copy frontend URL

### Step 4: Update CORS (30 sec)
1. Go back to Render backend settings
2. Update environment variables:
   ```
   FRONTEND_URL=[YOUR-FRONTEND-URL]
   CORS_ALLOWED_ORIGINS=[YOUR-FRONTEND-URL]
   ```
3. Redeploy backend

### Done! ✅
Visit your frontend URL and test the app!

---

## 🔑 Generate JWT Secret
```bash
# Linux/Mac
openssl rand -base64 32

# Or visit: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

---

## 📝 Connection String Format
```
jdbc:postgresql://db.[PROJECT-REF].supabase.co:5432/postgres?user=postgres&password=[PASSWORD]
```

Or use Supabase's connection string and convert to JDBC format.

---

## 🆘 Common Issues

**Backend won't start?**
- Check all environment variables are set
- Check database connection string format
- View logs in Render dashboard

**Frontend can't connect?**
- Check `REACT_APP_API_URL` is correct
- Check CORS settings in backend
- Check browser console for errors

**Database connection fails?**
- Verify Supabase project is active
- Check connection string format
- Ensure migrations ran successfully

---

For detailed guide, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

