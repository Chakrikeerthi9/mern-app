# Deployment Guide: MERN To-Do App

This guide walks you through deploying the backend on **Render** and frontend on **Vercel**, using **MongoDB Atlas** as the database.

---

## 📋 Prerequisites

1. **GitHub account** (to host your code)
2. **MongoDB Atlas account** (free tier)
3. **Render account** (free tier for backend)
4. **Vercel account** (free tier for frontend)

---

## 🗄️ Step 1: MongoDB Atlas Setup

### 1.1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a **free M0 cluster** (Shared, Free tier)

### 1.2. Configure Database Access
1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create username and password (save these!)
5. Set privileges to **Read and write to any database**
6. Click **Add User**

### 1.3. Configure Network Access
1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. For deployment, click **Allow Access from Anywhere** (`0.0.0.0/0`)
   - ⚠️ For production, restrict to specific IPs later
4. Click **Confirm**

### 1.4. Get Connection String
1. Go to **Database** → Click **Connect** on your cluster
2. Choose **Drivers** → Select **Node.js** → Version **5.5 or later**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your actual credentials
5. Replace the database name (after `.net/`) with `todo_db`:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/todo_db?retryWrites=true&w=majority
   ```
6. **Save this connection string** - you'll need it for Render!

---

## 🚀 Step 2: Deploy Backend on Render

### 2.1. Push Code to GitHub
1. Initialize git (if not already):
   ```bash
   cd /Users/chakrikeerthi/Downloads/MERN/todo-mern-app
   git init
   git add .
   git commit -m "Initial commit: MERN To-Do app"
   ```

2. Create a new repository on GitHub (e.g., `todo-mern-app`)

3. Push to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/todo-mern-app.git
   git branch -M main
   git push -u origin main
   ```

### 2.2. Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub account if not already connected
4. Select your repository: `todo-mern-app`

### 2.3. Configure Render Service
Fill in the following:

- **Name**: `todo-mern-backend` (or any name)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **Important!**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: **Free**

### 2.4. Set Environment Variables in Render
Click **Environment** tab and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string (from Step 1.4) |
| `NODE_ENV` | `production` |
| `PORT` | Leave empty (Render auto-assigns) |

⚠️ **Important**: Render will automatically set `PORT`, so your `server.js` should use `process.env.PORT || 5000` (which it already does).

### 2.5. Deploy
1. Click **Create Web Service**
2. Render will build and deploy (takes 2-5 minutes)
3. Once deployed, you'll see a URL like: `https://todo-mern-backend.onrender.com`
4. **Save this URL** - you'll need it for Vercel!

### 2.6. Test Backend
1. Visit: `https://your-backend-url.onrender.com/api/health`
2. Should return: `{"status":"ok"}`
3. If it works, your backend is live! ✅

---

## 🎨 Step 3: Deploy Frontend on Vercel

### 3.1. Import Project to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New...** → **Project**
3. Import your GitHub repository: `todo-mern-app`

### 3.2. Configure Vercel Project
Fill in:

- **Framework Preset**: `Create React App` (auto-detected)
- **Root Directory**: Click **Edit** → Set to `frontend` ⚠️ **Important!**
- **Build Command**: `npm run build` (default)
- **Output Directory**: `build` (default)
- **Install Command**: `npm install` (default)

### 3.3. Set Environment Variables in Vercel
Before deploying, click **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_BASE_URL` | `https://your-backend-url.onrender.com` (from Step 2.5) |

⚠️ **Important**: Replace `your-backend-url.onrender.com` with your actual Render backend URL!

### 3.4. Deploy
1. Click **Deploy**
2. Vercel will build and deploy (takes 1-3 minutes)
3. Once deployed, you'll get a URL like: `https://todo-mern-app.vercel.app`
4. **Your app is now live!** 🎉

### 3.5. Test Frontend
1. Visit your Vercel URL
2. Try adding a task - it should work!
3. Check browser console (F12) for any errors

---

## ✅ Step 4: Verify Everything Works

### 4.1. Test Backend Endpoints
Use curl or Postman:

```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Get all tasks
curl https://your-backend.onrender.com/api/tasks

# Create a task
curl -X POST https://your-backend.onrender.com/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","completed":false}'
```

### 4.2. Test Frontend
1. Open your Vercel URL
2. Add a task
3. Mark it complete
4. Delete it
5. All CRUD operations should work!

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend shows "Error connecting to MongoDB"
- **Solution**: Check `MONGODB_URI` in Render environment variables
- Ensure MongoDB Atlas network access allows `0.0.0.0/0`
- Verify username/password in connection string

**Problem**: Backend crashes on Render
- **Solution**: Check Render logs (Logs tab)
- Ensure `Root Directory` is set to `backend`
- Verify `Start Command` is `npm start`

### Frontend Issues

**Problem**: Frontend shows "Failed to load tasks"
- **Solution**: 
  - Check `REACT_APP_API_BASE_URL` in Vercel environment variables
  - Ensure backend URL is correct (no trailing slash)
  - Check browser console for CORS errors
  - Verify backend is running (test `/api/health`)

**Problem**: CORS errors in browser
- **Solution**: Backend CORS is configured to allow Vercel domains. If you see errors:
  - Check `backend/server.js` CORS configuration
  - Ensure backend is using the latest code with CORS updates

### MongoDB Issues

**Problem**: Can't connect to MongoDB Atlas
- **Solution**:
  - Verify network access includes `0.0.0.0/0` (or Render's IP)
  - Check database user credentials
  - Ensure connection string format is correct

---

## 📝 Summary

After deployment, you'll have:

- **Backend**: `https://your-backend.onrender.com` (Render)
- **Frontend**: `https://your-app.vercel.app` (Vercel)
- **Database**: MongoDB Atlas (free tier)

All three are connected and your MERN To-Do app is live! 🚀

---

## 🔄 Updating Your App

### Update Backend
1. Make changes locally
2. Test locally
3. Commit and push to GitHub
4. Render will auto-deploy

### Update Frontend
1. Make changes locally
2. Test locally
3. Commit to GitHub
4. Vercel will auto-deploy

Both platforms support **automatic deployments** on git push!

