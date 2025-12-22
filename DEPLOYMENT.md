# Deployment Guide - Service Booking Management Web App

## Vercel Deployment Steps

### 1. Set Up Environment Variables in Vercel

After pushing your code to GitHub, go to your Vercel project and add these environment variables:

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variables:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL (e.g., `https://xxxxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

**Important:** Make sure to add these for all environments (Production, Preview, and Development).

### 2. Where to Find Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → use for `VITE_SUPABASE_URL`
   - **anon/public key** → use for `VITE_SUPABASE_ANON_KEY`

### 3. Push Changes to GitHub

```bash
git add .
git commit -m "Fix: Use environment variables for Supabase config"
git push origin main
```

### 4. Redeploy on Vercel

After adding the environment variables:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Select **Redeploy**

Alternatively, just push new commits and Vercel will automatically deploy.

## Local Development Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

## Troubleshooting

### Build fails with "Could not resolve ./config.js"
- Make sure `config.js` is committed to your repository (it no longer contains secrets)
- Verify environment variables are set in Vercel

### App loads but shows Supabase errors
- Check that environment variables are correctly set in Vercel
- Verify the values match your Supabase project credentials
- Check browser console for specific error messages

### Changes not showing on Vercel
- Make sure you've pushed to the correct branch (usually `main`)
- Check Vercel deployment logs for build errors
- Verify auto-deploy is enabled in Vercel settings
