# Deployment Guide

This guide covers deploying the Career Intelligence Platform application to production.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment](#vercel-deployment)
3. [Railway Deployment](#railway-deployment)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment](#post-deployment)

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] PostgreSQL database (Supabase, Railway, or other)
- [ ] OpenAI API key with credits
- [ ] OAuth credentials (Google/GitHub) with production URLs
- [ ] NextAuth secret generated
- [ ] All environment variables ready
- [ ] Code pushed to GitHub repository

## Vercel Deployment (Recommended)

Vercel is the recommended platform as it's built by the Next.js team.

### Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/ai-career-copilot.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Import Project"**
3. **Select your GitHub repository**
4. **Configure Project:**
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### Step 3: Add Environment Variables

In Vercel dashboard, go to Settings > Environment Variables and add:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-here
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

### Step 5: Run Database Migrations

After deployment, you need to run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migrations
vercel env pull .env.production
npx prisma migrate deploy
```

## Railway Deployment

Railway provides both hosting and database in one platform.

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login and Initialize

```bash
railway login
railway init
```

### Step 3: Add PostgreSQL

```bash
railway add postgresql
```

This automatically creates a database and sets DATABASE_URL.

### Step 4: Set Environment Variables

```bash
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set OPENAI_API_KEY=sk-...
railway variables set GOOGLE_CLIENT_ID=...
railway variables set GOOGLE_CLIENT_SECRET=...
railway variables set GITHUB_CLIENT_ID=...
railway variables set GITHUB_CLIENT_SECRET=...
```

### Step 5: Deploy

```bash
railway up
```

### Step 6: Get Your URL

```bash
railway domain
```

Update NEXTAUTH_URL:
```bash
railway variables set NEXTAUTH_URL=https://your-app.railway.app
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host:5432/db |
| NEXTAUTH_URL | Your application URL | https://yourdomain.com |
| NEXTAUTH_SECRET | Random secret for NextAuth | Generate with: `openssl rand -base64 32` |
| OPENAI_API_KEY | OpenAI API key | sk-... |

### Optional Variables (OAuth)

| Variable | Description |
|----------|-------------|
| GOOGLE_CLIENT_ID | Google OAuth client ID |
| GOOGLE_CLIENT_SECRET | Google OAuth client secret |
| GITHUB_CLIENT_ID | GitHub OAuth client ID |
| GITHUB_CLIENT_SECRET | GitHub OAuth client secret |

## Database Setup

### Using Supabase (Recommended)

1. **Create Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for database to be ready

2. **Get Connection String:**
   - Go to Settings > Database
   - Copy "Connection string" (Transaction mode)
   - Replace [YOUR-PASSWORD] with your actual password

3. **Run Migrations:**
   ```bash
   DATABASE_URL="your-connection-string" npx prisma migrate deploy
   ```

4. **Seed Database (Optional):**
   ```bash
   DATABASE_URL="your-connection-string" npx prisma db seed
   ```

### Using Railway Database

Railway automatically provisions and connects the database when you add it.

```bash
railway add postgresql
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

## OAuth Configuration

### Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to APIs & Services > Credentials
4. Edit your OAuth 2.0 Client
5. Add authorized redirect URI:
   ```
   https://your-domain.com/api/auth/callback/google
   ```

### Update GitHub OAuth

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Select your OAuth App
3. Update Authorization callback URL:
   ```
   https://your-domain.com/api/auth/callback/github
   ```

## Post-Deployment

### 1. Test Authentication

- Try logging in with email/password
- Test Google OAuth
- Test GitHub OAuth

### 2. Test Core Features

- Upload a resume
- Generate interview questions
- Create a roadmap
- Check dashboard stats

### 3. Monitor Performance

**Vercel:**
- Go to Analytics tab
- Monitor response times
- Check error rates

**Railway:**
- Go to Metrics tab
- Monitor CPU and memory
- Check logs

### 4. Set Up Monitoring

**Sentry (Error Tracking):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

**Vercel Analytics:**
Already included in Vercel deployments.

### 5. Configure Custom Domain (Optional)

**Vercel:**
1. Go to Settings > Domains
2. Add your domain
3. Update DNS records
4. Update NEXTAUTH_URL

**Railway:**
1. Go to Settings > Domains
2. Add custom domain
3. Update DNS records
4. Update NEXTAUTH_URL

## Troubleshooting

### Build Failures

**Error: "Cannot find module '@prisma/client'"**
```bash
# Add postinstall script to package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

**Error: "Database connection failed"**
- Verify DATABASE_URL is correct
- Check database is accessible from deployment platform
- Ensure SSL mode is configured if required

### Runtime Errors

**Error: "NEXTAUTH_SECRET not set"**
- Add NEXTAUTH_SECRET to environment variables
- Redeploy application

**Error: "OpenAI API rate limit"**
- Check your OpenAI usage
- Add rate limiting to your API routes
- Consider caching responses

### Performance Issues

**Slow API responses:**
- Enable caching for AI responses
- Use database connection pooling
- Optimize Prisma queries

**High memory usage:**
- Reduce concurrent OpenAI requests
- Implement request queuing
- Use streaming for large responses

## Scaling Considerations

### Database

- Use connection pooling (PgBouncer)
- Add read replicas for heavy read workloads
- Implement caching (Redis)

### API

- Add rate limiting per user
- Implement request queuing for AI calls
- Cache common AI responses

### Storage

- Move file uploads to S3/Cloud Storage
- Implement CDN for static assets
- Compress uploaded files

## Security Checklist

- [ ] All environment variables are set
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] OAuth redirect URLs are correct
- [ ] Database has SSL enabled
- [ ] API routes have authentication
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] CORS is properly configured

## Cost Optimization

### OpenAI API

- Cache common responses
- Implement request deduplication
- Use GPT-3.5 for simpler tasks
- Set usage limits per user

### Database

- Use connection pooling
- Implement query optimization
- Archive old data
- Use appropriate indexes

### Hosting

- Optimize images and assets
- Enable compression
- Use edge caching
- Monitor bandwidth usage

## Backup Strategy

### Database Backups

**Supabase:**
- Automatic daily backups on paid plans
- Manual backups via dashboard

**Railway:**
- Automatic backups available
- Export via pg_dump

### Manual Backup

```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Import database
psql $DATABASE_URL < backup.sql
```

## Monitoring and Alerts

### Set Up Alerts

1. **OpenAI Usage:**
   - Set up billing alerts in OpenAI dashboard
   - Monitor daily usage

2. **Database:**
   - Monitor connection count
   - Set up storage alerts
   - Track query performance

3. **Application:**
   - Monitor error rates
   - Track response times
   - Set up uptime monitoring

## Support

For deployment issues:
- Check platform documentation (Vercel/Railway)
- Review application logs
- Test locally with production environment variables
- Create GitHub issue with deployment logs
