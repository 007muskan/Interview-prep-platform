# Complete Setup Guide

This guide will walk you through setting up the Career Intelligence Platform application from scratch.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Database Setup](#database-setup)
3. [OpenAI API Setup](#openai-api-setup)
4. [OAuth Setup](#oauth-setup)
5. [Application Setup](#application-setup)
6. [Troubleshooting](#troubleshooting)

## System Requirements

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- npm or yarn package manager
- Git

## Database Setup

### Option 1: Local PostgreSQL

1. **Install PostgreSQL:**
   - **macOS**: `brew install postgresql@14`
   - **Ubuntu**: `sudo apt-get install postgresql-14`
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

2. **Start PostgreSQL:**
   ```bash
   # macOS
   brew services start postgresql@14
   
   # Ubuntu
   sudo systemctl start postgresql
   
   # Windows
   # Use pgAdmin or Services app
   ```

3. **Create database:**
   ```bash
   psql postgres
   CREATE DATABASE career_copilot;
   CREATE USER your_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE career_copilot TO your_user;
   \q
   ```

4. **Update DATABASE_URL in .env:**
   ```
   DATABASE_URL="postgresql://your_user:your_password@localhost:5432/career_copilot?schema=public"
   ```

### Option 2: Cloud Database (Recommended for Production)

**Using Supabase (Free tier available):**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string from Settings > Database
4. Update DATABASE_URL in .env

**Using Railway (Free tier available):**
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update DATABASE_URL in .env

## OpenAI API Setup

1. **Create OpenAI Account:**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Sign up or log in

2. **Generate API Key:**
   - Navigate to API Keys section
   - Click "Create new secret key"
   - Copy the key (you won't see it again!)

3. **Add to .env:**
   ```
   OPENAI_API_KEY="sk-..."
   ```

4. **Add Credits:**
   - Go to Billing section
   - Add payment method
   - Purchase credits (minimum $5)

**Note:** The application uses GPT-4 Turbo which costs approximately:
- Resume analysis: ~$0.05 per analysis
- Interview questions: ~$0.02 per question
- Roadmap generation: ~$0.10 per roadmap

## OAuth Setup

### Google OAuth (Optional)

1. **Go to Google Cloud Console:**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select existing

2. **Enable APIs:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://yourdomain.com/api/auth/callback/google`

4. **Add to .env:**
   ```
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

### GitHub OAuth (Optional)

1. **Go to GitHub Settings:**
   - Visit [github.com/settings/developers](https://github.com/settings/developers)
   - Click "New OAuth App"

2. **Configure Application:**
   - Application name: "Career Intelligence Platform"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

3. **Generate Client Secret:**
   - Click "Generate a new client secret"
   - Copy both Client ID and Secret

4. **Add to .env:**
   ```
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

## Application Setup

1. **Clone and Install:**
   ```bash
   git clone <repository-url>
   cd ai-career-copilot
   npm install
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Generate NextAuth Secret:**
   ```bash
   openssl rand -base64 32
   # Copy output to NEXTAUTH_SECRET in .env
   ```

4. **Initialize Database:**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Create database tables
   npx prisma migrate dev --name init
   
   # View database in browser
   npx prisma studio
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```

6. **Test the Application:**
   - Open http://localhost:3000
   - Create an account
   - Upload a resume
   - Try interview prep
   - Generate a roadmap

## Production Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from .env
   - Deploy

3. **Update OAuth Redirect URLs:**
   - Add production URLs to Google/GitHub OAuth settings
   - Update NEXTAUTH_URL in Vercel environment variables

### Alternative: Deploy to Railway

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add Environment Variables:**
   ```bash
   railway variables set OPENAI_API_KEY=sk-...
   # Add all other variables
   ```

## Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**
- Check if PostgreSQL is running
- Verify DATABASE_URL format
- Check firewall settings

**Solution:**
```bash
# Test connection
psql $DATABASE_URL

# Reset database
npx prisma migrate reset
```

### OpenAI API Issues

**Error: "Insufficient quota"**
- Check billing at platform.openai.com
- Add credits to your account

**Error: "Invalid API key"**
- Verify OPENAI_API_KEY in .env
- Regenerate key if needed

### NextAuth Issues

**Error: "No secret provided"**
- Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- Add to .env file

**Error: "OAuth callback error"**
- Verify redirect URLs match exactly
- Check OAuth credentials

### Build Issues

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**Error: "Prisma Client not generated"**
```bash
npx prisma generate
```

## Development Tips

1. **Use Prisma Studio for database management:**
   ```bash
   npx prisma studio
   ```

2. **Monitor API usage:**
   - Check OpenAI dashboard regularly
   - Set up usage alerts

3. **Test with sample data:**
   - Create test users
   - Upload sample resumes
   - Test all features

4. **Enable logging:**
   - Check browser console
   - Monitor server logs
   - Use Vercel logs in production

## Support

For issues and questions:
- Check existing GitHub issues
- Create a new issue with details
- Include error messages and logs
- Provide steps to reproduce

## Next Steps

After setup:
1. Customize the UI to match your brand
2. Add more interview question categories
3. Integrate job board APIs
4. Add analytics and tracking
5. Implement email notifications
6. Add payment integration for premium features
