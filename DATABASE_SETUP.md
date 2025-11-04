# Database Setup Guide

This guide will help you fix the 500 Internal Server Errors you're experiencing with login and signup.

## Problem

The errors you're seeing:
```
POST /api/auth/login 500 (Internal Server Error)
POST /api/auth/signup 500 (Internal Server Error)
```

These are caused by one of the following issues:
1. Database tables haven't been created yet
2. DATABASE_URL environment variable is not set in Vercel
3. Database connection issues

## Solution

### Step 1: Set Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `learn-coding-website`
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string from Neon
     - Example: `postgresql://username:password@host/database?sslmode=require`
   - **Environment**: Production, Preview, Development (check all)

5. Optional but recommended:
   - **Name**: `SESSION_SECRET`
   - **Value**: A random secure string (generate one at https://randomkeygen.com/)

### Step 2: Initialize Database Tables

After setting the environment variables, you have two options:

#### Option A: Use the Automatic Initialization Endpoint (Recommended)

1. Redeploy your Vercel app (or wait for it to redeploy automatically)
2. Visit this URL in your browser:
   ```
   https://learn-coding-website.vercel.app/api/init-db
   ```
3. You should see a success message: `"Database tables initialized successfully"`

#### Option B: Run SQL Manually

1. Go to your Neon dashboard: https://console.neon.tech/
2. Select your database
3. Open the SQL Editor
4. Copy and paste the contents of `schema.sql` into the editor
5. Click "Run" to execute the SQL

### Step 3: Verify the Fix

1. Try to sign up or log in again
2. The errors should now be resolved
3. Check the browser console for any remaining errors

## Troubleshooting

### Still Getting 500 Errors?

1. **Check Vercel Logs**:
   - Go to your Vercel dashboard
   - Click on your project
   - Go to **Deployments** → Click on the latest deployment
   - Click on **Functions** → Find the error logs
   - Look for specific error messages

2. **Check if DATABASE_URL is Set**:
   - Visit: `https://learn-coding-website.vercel.app/api/health`
   - Should return: `{"status":"ok","message":"Server running"}`

3. **Check Database Connection**:
   - The error logs will show specific error codes:
     - `42P01`: Tables don't exist → Run `/api/init-db`
     - `ECONNREFUSED`: Can't connect to database → Check DATABASE_URL
     - `ENOTFOUND`: Invalid database host → Check DATABASE_URL

### Database Connection String Format

Your Neon connection string should look like this:
```
postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

Make sure:
- You're using the **Connection Pooler** URL (not the direct connection)
- SSL mode is enabled (`?sslmode=require`)
- The password is URL-encoded if it contains special characters

## After Setup

Once everything is working:
1. The `/api/auth/signup` endpoint will create new user accounts
2. The `/api/auth/login` endpoint will authenticate users
3. User data will be stored in your PostgreSQL database
4. Sessions will be managed automatically

## Security Notes

- Passwords are hashed using bcrypt before storage
- Sessions use secure cookies in production
- The database connection uses SSL encryption
- Never commit your DATABASE_URL or SESSION_SECRET to Git

## Need Help?

If you're still having issues:
1. Check the Vercel function logs for detailed error messages
2. Verify your DATABASE_URL is correctly set
3. Make sure the database tables were created successfully
4. Contact support with the specific error message from the logs
