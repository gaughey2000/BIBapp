# 🚀 Render Deployment Setup

## Environment Variables Required on Render

Set these in your Render dashboard (Settings → Environment):

### Critical Variables

```bash
# Database (Render will provide this)
DATABASE_URL=<Your Render PostgreSQL connection string>

# JWT Secret (generate a strong secret)
JWT_SECRET=<Use a strong random string - at least 32 characters>

# Frontend URL (your deployed client URL)
CLIENT_URL=https://your-app.onrender.com

# Environment
NODE_ENV=production

# Server Port (Render sets this automatically)
PORT=4000

# Timezone
TZ=Europe/London
```

## How to Set Environment Variables on Render

1. Go to your Render dashboard
2. Select your **Web Service** (backend)
3. Click **Environment** in the left sidebar
4. Click **Add Environment Variable**
5. Add each variable from above

### Getting Your DATABASE_URL

If you're using Render's PostgreSQL:
1. Go to your PostgreSQL database on Render
2. Copy the **Internal Database URL** 
3. Paste it as `DATABASE_URL` in your web service

Format: `postgresql://user:password@host:5432/database`

### Generating JWT_SECRET

Run this in your terminal to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

### CLIENT_URL

This is your frontend URL. Examples:
- Production: `https://your-app.onrender.com`
- Custom domain: `https://yourdomain.com`

**Important:** No trailing slash!

## Build & Start Commands on Render

When creating your web service on Render:

### Build Command:
```bash
npm install && npm run prisma:generate && npm run prisma:deploy
```

### Start Command:
```bash
npm start
```

## Database Migrations

The `prisma:deploy` command in the build script will automatically run migrations. Your database schema will be created/updated on each deployment.

## Checking Deployment Status

After deployment, check these URLs:

1. **Health Check**: `https://your-api.onrender.com/health`
   - Should return: `{"server":"ok","database":"ok",...}`

2. **Services API**: `https://your-api.onrender.com/api/services`
   - Should return an array of services

## Troubleshooting

### Database Connection Errors

If you see "Environment variable not found: DATABASE_URL":
- Check that `DATABASE_URL` is set in Render environment variables
- Verify it's the correct Internal Database URL from your Render PostgreSQL
- Make sure there are no extra spaces

### JWT Secret Missing

If you see "Missing required env: JWT_SECRET":
- Generate a strong secret (see above)
- Add it to Render environment variables
- Redeploy

### CORS Errors

If your frontend can't connect:
- Check `CLIENT_URL` matches your actual frontend URL
- Ensure `CLIENT_URL` has no trailing slash
- Check browser console for specific CORS errors

## Schema Changes & Migrations

When you update your Prisma schema:

1. Locally: Create migration with `npm run prisma:dev`
2. Commit the new migration files
3. Push to GitHub
4. Render will auto-deploy and run migrations

## Current Schema

After this refactoring, your database has:
- ✅ `User` table (admin authentication)
- ✅ `Service` table (treatments)
- ❌ `Booking` (removed)
- ❌ `BlackoutSlot` (removed)  
- ❌ `BusinessHour` (removed)

Simple and focused! 🎯

## Need Help?

Check Render logs:
1. Go to your web service dashboard
2. Click **Logs** tab
3. Look for errors in red

Common issues:
- Missing environment variables
- Database connection failures
- Build command failures

All of these will show in the logs with specific error messages.
