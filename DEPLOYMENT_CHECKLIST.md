# ✅ Deployment Checklist

Use this checklist to ensure everything is set up correctly for deployment.

## 📋 Pre-Deployment

- [ ] Code is pushed to GitHub repository
- [ ] All local changes are committed
- [ ] `.env` files are NOT committed (check `.gitignore`)
- [ ] Database migrations are ready
- [ ] JWT secret is generated

## 🗄️ Database Setup (Supabase)

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Ran migration `V1__create_tables.sql`
- [ ] Ran migration `V2__fix_user_roles_enum.sql`
- [ ] Ran migration `V3__fix_reminder_enums.sql`
- [ ] Copied database connection string
- [ ] Tested database connection

## 🔧 Backend Deployment (Render/Railway)

- [ ] Created account on Render/Railway
- [ ] Connected GitHub repository
- [ ] Set root directory to `backend`
- [ ] Set build command: `mvn clean package -DskipTests`
- [ ] Set start command: `java -jar target/*.jar`
- [ ] Set environment: `Java 17`

### Environment Variables Set:
- [ ] `SPRING_PROFILES_ACTIVE=prod`
- [ ] `SERVER_PORT=10000`
- [ ] `DB_URL=[SUPABASE-CONNECTION-STRING]`
- [ ] `DB_USERNAME=postgres`
- [ ] `DB_PASSWORD=[PASSWORD]`
- [ ] `JWT_SECRET=[32-CHAR-SECRET]`
- [ ] `FRONTEND_URL=[WILL-UPDATE-AFTER-FRONTEND]`
- [ ] `CORS_ALLOWED_ORIGINS=[WILL-UPDATE-AFTER-FRONTEND]`
- [ ] `MAIL_HOST=smtp.gmail.com` (optional)
- [ ] `MAIL_USERNAME=[EMAIL]` (optional)
- [ ] `MAIL_PASSWORD=[APP-PASSWORD]` (optional)

- [ ] Backend deployed successfully
- [ ] Backend URL noted: `https://[YOUR-BACKEND].onrender.com`
- [ ] Tested backend health endpoint
- [ ] Tested API endpoint (e.g., `/api/health`)

## 🎨 Frontend Deployment (Vercel/Netlify)

- [ ] Created account on Vercel/Netlify
- [ ] Connected GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `build`

### Environment Variables Set:
- [ ] `REACT_APP_API_URL=https://[YOUR-BACKEND].onrender.com/api`

- [ ] Frontend deployed successfully
- [ ] Frontend URL noted: `https://[YOUR-FRONTEND].vercel.app`

## 🔄 Post-Deployment Updates

- [ ] Updated backend `FRONTEND_URL` environment variable
- [ ] Updated backend `CORS_ALLOWED_ORIGINS` environment variable
- [ ] Redeployed backend (if needed)
- [ ] Verified CORS is working (check browser console)

## ✅ Testing

- [ ] Frontend loads without errors
- [ ] Can access registration page
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Can access dashboard after login
- [ ] API calls work (check Network tab)
- [ ] No CORS errors in browser console
- [ ] No 401/403 errors

## 🔐 Security Checklist

- [ ] JWT secret is strong (32+ characters, random)
- [ ] Database password is strong
- [ ] Environment variables are set (not hardcoded)
- [ ] CORS is configured correctly
- [ ] No sensitive data in code
- [ ] `.env` files are in `.gitignore`

## 📊 Monitoring

- [ ] Backend logs are accessible
- [ ] Frontend logs are accessible
- [ ] Error tracking set up (optional)
- [ ] Database monitoring enabled (Supabase dashboard)

## 🎉 Final Steps

- [ ] Share frontend URL with team/users
- [ ] Document any custom configurations
- [ ] Set up automatic deployments (already enabled by default)
- [ ] Test on different devices/browsers

---

## 🆘 If Something Goes Wrong

1. **Check deployment logs** in Render/Vercel dashboard
2. **Verify environment variables** are set correctly
3. **Test API endpoints** directly (curl/Postman)
4. **Check browser console** for frontend errors
5. **Verify database connection** in Supabase dashboard
6. **Check CORS settings** match frontend URL

---

**Deployment Complete! 🚀**

