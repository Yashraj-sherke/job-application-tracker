# Deployment Guide

This guide covers deploying the Job Application Tracker to production.

## 🌐 Deployment URLs

- **Frontend (Vercel)**: https://vercel.com/chut-burs-projects/job-application-tracker
- **Backend (Render)**: https://job-application-tracker-uqbn.onrender.com

---

## 📋 Prerequisites

- Vercel account (for frontend)
- Render account (for backend)
- MongoDB Atlas database
- Git repository

---

## 🔧 Backend Deployment (Render)

### 1. Environment Variables on Render

Configure these environment variables in your Render dashboard:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/JobTrackerDB?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-vercel-app.vercel.app
```

> **Important**: Replace `FRONTEND_URL` with your actual Vercel deployment URL once you have it.

### 2. Build Configuration

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

### 3. CORS Configuration

The backend is already configured to accept requests from:
- `localhost:5173` (local development)
- `localhost:3000` (alternative local port)
- Any `*.vercel.app` domain (Vercel deployments)
- The specific `FRONTEND_URL` from environment variables

This is configured in [`backend/src/server.ts`](file:///c:/Users/HP/Desktop/Job%20Port/backend/src/server.ts#L27-L56).

### 4. Health Check

Verify your backend is running:
```bash
curl https://job-application-tracker-uqbn.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-31T22:39:45.590Z",
  "uptime": 47.8747746,
  "environment": "production"
}
```

---

## 🎨 Frontend Deployment (Vercel)

### 1. Environment Variables on Vercel

Add this environment variable in your Vercel project settings:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://job-application-tracker-uqbn.onrender.com/api` |

**How to add**:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add `VITE_API_URL` with the backend URL
4. Click **Save**

### 2. Build Configuration

Vercel should auto-detect Vite. If not, configure:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Root Directory**: `frontend`

### 3. Deployment

```bash
# From the frontend directory
cd frontend

# Deploy to Vercel
vercel --prod
```

Or push to your Git repository and Vercel will auto-deploy.

---

## 🧪 Testing the Deployment

### 1. Test Backend API

```bash
# Health check
curl https://job-application-tracker-uqbn.onrender.com/api/health

# Test auth endpoint (should return 401 without credentials)
curl https://job-application-tracker-uqbn.onrender.com/api/auth/me
```

### 2. Test Frontend

1. Visit your Vercel URL
2. You should see the login page
3. Try logging in with demo credentials (if you have a demo user in your database)
4. Check browser console for any CORS or network errors

### 3. Common Issues

#### CORS Errors
- **Symptom**: Browser console shows CORS policy errors
- **Solution**: Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly
- **Note**: The backend already allows all `*.vercel.app` domains

#### API Connection Failed
- **Symptom**: Frontend shows "Network error" or loading indefinitely
- **Solution**: 
  - Verify `VITE_API_URL` is set correctly in Vercel
  - Check Render backend is running (visit health endpoint)
  - Ensure MongoDB is connected (check Render logs)

#### Authentication Issues
- **Symptom**: Can't login or session expires immediately
- **Solution**: 
  - Verify `JWT_SECRET` is set in Render
  - Check cookies are being sent (credentials: true in CORS)
  - Ensure HTTPS is used (required for secure cookies)

---

## 🔄 Local Development

### Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Environment Files

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env.local`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📊 Monitoring

### Render Dashboard
- Monitor backend logs
- Check CPU/Memory usage
- View deployment history

### Vercel Dashboard
- Monitor build logs
- Check deployment status
- View analytics

---

## 🔐 Security Checklist

- ✅ JWT_SECRET is strong and unique
- ✅ MongoDB credentials are secure
- ✅ CORS is properly configured
- ✅ Environment variables are not committed to Git
- ✅ HTTPS is enforced on production
- ✅ Rate limiting is configured (if applicable)

---

## 📝 Notes

1. **Render Free Tier**: Backend may spin down after inactivity. First request after inactivity will be slow (30-60 seconds).

2. **MongoDB Atlas**: Ensure your IP whitelist includes `0.0.0.0/0` for Render to connect, or add Render's IP addresses.

3. **Vercel Previews**: Every PR gets a preview deployment. The backend CORS is configured to accept all `*.vercel.app` domains.

4. **Environment Variables**: After changing environment variables on Vercel or Render, you need to redeploy for changes to take effect.

---

## 🆘 Support

If you encounter issues:

1. Check Render logs: `Dashboard → Logs`
2. Check Vercel logs: `Deployments → [Your Deployment] → Build Logs`
3. Test API endpoints directly with curl
4. Check browser console for frontend errors
4. Check browser console for frontend errors\r
\r
---\r
\r
## 🔍 Detailed Troubleshooting Guide\r
\r
### Issue 1: "401 Unauthorized" on /api/auth/me\r
\r
**Symptoms:**\r
- User can login successfully\r
- Immediately logged out or shows as unauthorized\r
- Session doesn't persist after page refresh\r
\r
**Causes & Solutions:**\r
\r
1. **Cookie not being sent from frontend**\r
   - **Check:** Open DevTools → Application → Cookies\r
   - **Solution:** Ensure `credentials: 'include'` is set in axios config\r
   - **Verify:** Cookie should have `SameSite=None` and `Secure` flags in production\r
\r
2. **CORS blocking cookies**\r
   - **Check:** Browser console for CORS errors\r
   - **Solution:** Verify `FRONTEND_URL` on Render matches your Vercel URL exactly\r
   - **Verify:** Backend CORS config has `credentials: true`\r
\r
3. **Cookie settings incorrect for cross-origin**\r
   - **Check:** Cookie settings in `routes/auth.ts`\r
   - **Solution:** Ensure production cookies have:\r
     ```typescript\r
     secure: true,\r
     sameSite: 'none',\r
     httpOnly: true\r
     ```\r
\r
### Issue 2: CORS Errors\r
\r
**Symptoms:**\r
- "Access to fetch at '...' from origin '...' has been blocked by CORS policy"\r
- Network requests fail with CORS errors\r
\r
**Solutions:**\r
\r
1. **Verify FRONTEND_URL environment variable**\r
   ```bash\r
   # On Render dashboard, check that FRONTEND_URL is set to:\r
   https://your-actual-vercel-url.vercel.app\r
   ```\r
\r
2. **Check backend CORS configuration**\r
   - Backend already allows all `*.vercel.app` domains\r
   - Verify in Render logs that CORS middleware is working\r
\r
3. **Ensure frontend is making requests with credentials**\r
   - Check axios configuration includes `withCredentials: true`\r
\r
### Issue 3: Environment Variables Not Loading\r
\r
**Frontend (Vercel):**\r
\r
1. **Verify environment variable is set**\r
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables\r
   - Ensure `VITE_API_URL` is set for all environments (Production, Preview, Development)\r
\r
2. **Redeploy after adding variables**\r
   - Environment variables only apply to NEW deployments\r
   - Trigger a new deployment after adding/changing variables\r
\r
3. **Check variable name prefix**\r
   - Vite requires `VITE_` prefix for client-side variables\r
   - Variable must be `VITE_API_URL`, not just `API_URL`\r
\r
**Backend (Render):**\r
\r
1. **Check all required variables are set**\r
   - `NODE_ENV=production`\r
   - `MONGODB_URI` (your MongoDB Atlas connection string)\r
   - `JWT_SECRET` (minimum 32 characters)\r
   - `FRONTEND_URL` (your Vercel URL)\r
\r
2. **Verify in Render logs**\r
   - Check startup logs for environment validation errors\r
   - Look for "Environment variables validated successfully" message\r
\r
### Issue 4: MongoDB Connection Failed\r
\r
**Symptoms:**\r
- Backend fails to start\r
- "MongooseError: Could not connect to any servers"\r
\r
**Solutions:**\r
\r
1. **Check MongoDB Atlas IP Whitelist**\r
   - Go to MongoDB Atlas → Network Access\r
   - Add `0.0.0.0/0` to allow connections from anywhere (Render uses dynamic IPs)\r
\r
2. **Verify connection string**\r
   - Ensure `MONGODB_URI` includes username, password, and database name\r
   - Check for special characters in password (may need URL encoding)\r
\r
3. **Test connection string locally**\r
   ```bash\r
   # Use mongosh or MongoDB Compass to test the connection string\r
   ```\r
\r
### Issue 5: Build Failures\r
\r
**Frontend Build Fails:**\r
\r
1. **TypeScript errors**\r
   - Check Vercel build logs for specific errors\r
   - Ensure all TypeScript errors are fixed locally first\r
\r
2. **Missing dependencies**\r
   - Verify `package.json` includes all dependencies\r
   - Run `npm install` locally to ensure lock file is updated\r
\r
**Backend Build Fails:**\r
\r
1. **Check Render build logs**\r
   - Look for TypeScript compilation errors\r
   - Ensure `dist` directory is being created\r
\r
2. **Verify build command**\r
   - Should be: `npm ci && npm run build`\r
   - Check `package.json` has correct build script\r
\r
### Issue 6: Render Free Tier Cold Starts\r
\r
**Symptoms:**\r
- First request after inactivity takes 30-60 seconds\r
- Subsequent requests are fast\r
\r
**Explanation:**\r
- Render free tier spins down after 15 minutes of inactivity\r
- First request "wakes up" the service\r
\r
**Solutions:**\r
- Upgrade to paid tier for always-on service\r
- Or accept the cold start delay (normal for free tier)\r
- Consider adding a health check ping service (e.g., UptimeRobot)\r
\r
### Quick Diagnostic Commands\r
\r
```bash\r
# Test backend health\r
curl https://job-application-tracker-uqbn.onrender.com/api/health\r
\r
# Test CORS (replace with your Vercel URL)\r
curl -H "Origin: https://your-app.vercel.app" \\\r
     -H "Access-Control-Request-Method: POST" \\\r
     -H "Access-Control-Request-Headers: Content-Type" \\\r
     -X OPTIONS \\\r
     https://job-application-tracker-uqbn.onrender.com/api/auth/login\r
\r
# Check if cookies are being set (look for Set-Cookie header)\r
curl -v -X POST https://job-application-tracker-uqbn.onrender.com/api/auth/login \\\r
     -H "Content-Type: application/json" \\\r
     -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'\r
```\r
\r
---\r
\r
## 📱 Testing Checklist\r
\r
After deployment, test these scenarios:\r
\r
- [ ] Visit frontend URL - page loads correctly\r
- [ ] Register new account - redirects to dashboard\r
- [ ] Login with existing account - redirects to dashboard\r
- [ ] Refresh page while logged in - stays logged in\r
- [ ] Create new job application - saves successfully\r
- [ ] Edit job application - updates successfully\r
- [ ] Delete job application - removes successfully\r
- [ ] Logout - redirects to login page\r
- [ ] Try accessing dashboard while logged out - redirects to login\r
\r
