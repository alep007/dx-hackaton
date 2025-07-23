# Deployment Guide

This guide will help you deploy both the backend (NestJS) and frontend (Next.js) applications.

## Prerequisites

1. **GitHub Repository**: Make sure both projects are in a GitHub repository
2. **MongoDB Atlas Account**: For the database (free tier available)
3. **Railway Account**: For backend deployment (free tier available)
4. **Vercel Account**: For frontend deployment (free tier available)

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/travel-app`)

## Step 2: Deploy Backend (Railway)

1. Go to [Railway](https://railway.app) and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository and the `pnlp-b` directory
4. Railway will automatically detect it's a Node.js app
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: 3001 (or leave empty for Railway to assign)
   - `FRONTEND_URL`: Your frontend URL (we'll update this after frontend deployment)
6. Deploy and get your backend URL (e.g., `https://your-app.railway.app`)

## Step 3: Deploy Frontend (Vercel)

1. Go to [Vercel](https://vercel.com) and sign up with GitHub
2. Click "New Project" → "Import Git Repository"
3. Select your repository and the `pnlp-f` directory
4. Vercel will automatically detect it's a Next.js app
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL from Railway
6. Deploy and get your frontend URL (e.g., `https://your-app.vercel.app`)

## Step 4: Update CORS Configuration

After getting your frontend URL, update the backend environment variable:
1. Go back to Railway dashboard
2. Update the `FRONTEND_URL` environment variable with your Vercel frontend URL
3. Redeploy the backend

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Test the trip creation and monitoring features
3. Check that real-time updates work via WebSocket

## Alternative Deployment Options

### Backend Alternatives:
- **Render**: Similar to Railway, good free tier
- **Heroku**: More established but requires credit card for free tier
- **DigitalOcean App Platform**: Good performance, paid

### Frontend Alternatives:
- **Netlify**: Great for static sites, good free tier
- **GitHub Pages**: Free but limited for Next.js
- **AWS Amplify**: Good for full-stack apps

## Environment Variables Reference

### Backend (Railway)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-app
PORT=3001
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure `FRONTEND_URL` is correctly set in backend
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **WebSocket Issues**: Ensure both frontend and backend URLs are HTTPS in production
4. **Build Failures**: Check that all dependencies are in `package.json`

### Debugging:
- Check Railway logs for backend issues
- Check Vercel build logs for frontend issues
- Use browser dev tools to check network requests
- Verify environment variables are set correctly

## Cost Estimation

- **Railway**: Free tier includes 500 hours/month
- **Vercel**: Free tier includes unlimited deployments
- **MongoDB Atlas**: Free tier includes 512MB storage
- **Total**: $0/month for small to medium usage 