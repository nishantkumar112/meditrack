# Frontend API URL Configuration Fix

## Problem

The frontend was calling `http://localhost:8081/api` instead of the Render backend URL `https://meditrack-nsv6.onrender.com/api`.

## Root Causes

1. **Wrong Environment Variable Syntax**: Code was using `import.meta.env.VITE_API_URL` (Vite syntax) instead of `process.env.REACT_APP_API_URL` (Create React App syntax)
2. **Docker Build Configuration**: The Dockerfile wasn't configured to receive the environment variable during build time

## Solution Applied

### 1. Fixed API Configuration (`frontend/src/services/api.js`)
```javascript
// Changed from:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

// To:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';
```

### 2. Updated Dockerfile (`frontend/Dockerfile`)
- Added `ARG REACT_APP_API_URL` to accept build-time argument
- Added `ENV REACT_APP_API_URL=${REACT_APP_API_URL}` to make it available during build
- Added logic to create `.env` file from the build argument as a fallback

## Steps to Fix in Render Dashboard

### Step 1: Verify Environment Variable

1. Go to **Render Dashboard** → Your frontend service (`meditrack-frontend`)
2. Go to **Environment** tab
3. Verify `REACT_APP_API_URL` is set to:
   ```
   https://meditrack-nsv6.onrender.com/api
   ```
   ⚠️ **Important**: Make sure it includes `/api` at the end

### Step 2: Redeploy

1. After setting/updating the environment variable, click **Manual Deploy** → **Deploy latest commit**
2. Or push new code to trigger automatic deployment

### Step 3: Verify Build Logs

Check the build logs for:
```
Created .env with REACT_APP_API_URL=https://meditrack-nsv6.onrender.com/api
```

If you see this message, the environment variable was correctly passed to the build.

## Verification

After deployment:

1. **Open browser DevTools** (F12)
2. Go to **Network** tab
3. Try to login or make any API call
4. Check the request URL - it should be:
   ```
   https://meditrack-nsv6.onrender.com/api/auth/login
   ```
   Not:
   ```
   http://localhost:8081/api/auth/login
   ```

## Troubleshooting

### Still seeing localhost URL?

1. **Check environment variable in Render**:
   - Go to frontend service → Environment
   - Verify `REACT_APP_API_URL` is set correctly
   - Make sure there are no typos

2. **Clear browser cache**:
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache completely

3. **Check build logs**:
   - Look for the "Created .env" message
   - If you see "Warning: REACT_APP_API_URL not set", the variable wasn't passed

4. **Verify the variable name**:
   - Must be exactly: `REACT_APP_API_URL` (case-sensitive)
   - Must start with `REACT_APP_` prefix for Create React App

5. **Redeploy after changes**:
   - Environment variable changes require a new build
   - Click **Manual Deploy** after updating env vars

## Important Notes

- **Create React App** embeds environment variables at **build time**, not runtime
- The variable must be available during the Docker build process
- Changes to environment variables require a **new build/deployment**
- The variable name must start with `REACT_APP_` prefix

## Environment Variable Format

✅ **Correct**:
```
REACT_APP_API_URL=https://meditrack-nsv6.onrender.com/api
```

❌ **Wrong**:
```
REACT_APP_API_URL=https://meditrack-nsv6.onrender.com  (missing /api)
VITE_API_URL=https://meditrack-nsv6.onrender.com/api  (wrong prefix)
REACT_APP_API_URL=http://meditrack-nsv6.onrender.com/api  (should use https)
```

---

**Last Updated**: After fixing API URL configuration issue
