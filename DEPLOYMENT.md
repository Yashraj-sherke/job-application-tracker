# Deploying Job Application Tracker to Render

This guide walks you through deploying the Job Application Tracker to Render's cloud platform.

## Prerequisites

- [Render account](https://render.com/) (free tier available)
- [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas) (free tier available)
- Your code pushed to a GitHub repository

## Part 1: Backend Deployment on Render

### Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (or use existing)
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your actual password
6. Add `/JobTrackerDB` before the `?` to specify the database name

### Step 2: Deploy Backend to Render

1. **Log in to Render** at [render.com](https://render.com/)

2. **Create New Web Service**:
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Select your `Job Port` repository

3. **Configure the service**:
   ```
   Name: job-tracker-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Set Environment Variables**:
   Click **"Advanced"** → **"Add Environment Variable"** and add:
   
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-secure-secret>
   JWT_EXPIRE=7d
   FRONTEND_URL=<will-add-after-frontend-deployment>
   ```

   **To generate a secure JWT_SECRET**, run this locally:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. **Create Web Service** - Render will start building and deploying

6. **Note your backend URL**: After deployment, you'll get a URL like:
   ```
   https://job-tracker-backend-xxxx.onrender.com
   ```

### Step 3: Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2026-01-26T..."
}
```

## Part 2: Frontend Deployment

You have three options for deploying the frontend:

### Option A: Vercel (Recommended - Easiest)

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com/)
   - Click **"Add New"** → **"Project"**
   - Import your GitHub repository
   - Configure:
     ```
     Framework Preset: Vite
     Root Directory: frontend
     Build Command: npm run build
     Output Directory: dist
     ```

3. **Add Environment Variable**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Deploy** - Vercel will build and deploy automatically

### Option B: Netlify

1. Go to [netlify.com](https://netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub and select your repository
4. Configure:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
6. Deploy

### Option C: Render Static Site

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect your repository
3. Configure:
   ```
   Name: job-tracker-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
5. Create Static Site

## Part 3: Update Backend CORS

After deploying the frontend, you'll have a URL like:
- Vercel: `https://your-app.vercel.app`
- Netlify: `https://your-app.netlify.app`
- Render: `https://your-app.onrender.com`

**Update the backend's `FRONTEND_URL` environment variable**:

1. Go to your backend service on Render
2. Click **"Environment"**
3. Update `FRONTEND_URL` to your frontend URL
4. Click **"Save Changes"** - Render will redeploy automatically

## Part 4: Verify Deployment

1. **Visit your frontend URL**
2. **Test user registration**:
   - Create a new account
   - Verify you can log in

3. **Test job application features**:
   - Create a new job application
   - Update status (drag & drop on Kanban board)
   - Add interactions/notes
   - Test CSV import/export

4. **Check browser console** for any errors

## Troubleshooting

### Backend Issues

**Build fails**:
- Check that `package.json` has correct scripts
- Verify all dependencies are in `dependencies`, not `devDependencies`

**Database connection fails**:
- Verify MongoDB Atlas connection string is correct
- Check that your IP is whitelisted in MongoDB Atlas (or allow all: `0.0.0.0/0`)
- Ensure database user has read/write permissions

**Health check fails**:
- Check logs in Render dashboard
- Verify `/api/health` endpoint is accessible

### Frontend Issues

**API calls fail (CORS errors)**:
- Verify `FRONTEND_URL` is set correctly on backend
- Check that backend URL in frontend env variable is correct
- Ensure URLs don't have trailing slashes

**Environment variables not working**:
- Verify env variables start with `VITE_`
- Redeploy after adding/changing env variables
- Check build logs for errors

**Build fails**:
- Run `npm run build` locally to test
- Check for TypeScript errors
- Verify all dependencies are installed

### General Tips

- **Free tier sleep**: Render free tier services sleep after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.
- **Logs**: Always check Render logs for detailed error messages
- **Redeploy**: After changing environment variables, services auto-redeploy
- **HTTPS**: All Render services use HTTPS by default

## Production Checklist

- [ ] MongoDB Atlas cluster is secured (strong password, IP whitelist)
- [ ] JWT_SECRET is a strong, randomly generated value
- [ ] Environment variables are set correctly on both services
- [ ] CORS is configured with actual frontend URL
- [ ] Health check endpoint responds successfully
- [ ] User registration and login work
- [ ] All CRUD operations for job applications work
- [ ] CSV import/export functionality works
- [ ] No console errors in browser

## Updating Your Application

When you push changes to GitHub:
- **Render**: Auto-deploys if you enabled auto-deploy
- **Vercel/Netlify**: Auto-deploys on every push to main branch

To manually redeploy:
- Go to your service dashboard
- Click **"Manual Deploy"** → **"Deploy latest commit"**

## Cost Considerations

**Free Tier Limits**:
- Render: 750 hours/month, services sleep after 15 min inactivity
- Vercel: 100 GB bandwidth, unlimited deployments
- Netlify: 100 GB bandwidth, 300 build minutes
- MongoDB Atlas: 512 MB storage

For production use with high traffic, consider upgrading to paid tiers.
