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
