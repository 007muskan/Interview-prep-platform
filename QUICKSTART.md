# Quick Start Guide

Get up and running with Career Intelligence Platform in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- OpenAI API key

## Quick Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd ai-career-copilot
npm install
```

### 2. Set Up Environment

```bash
# Copy environment template
cp .env.example .env

# Generate NextAuth secret
openssl rand -base64 32

# Edit .env and add:
# - DATABASE_URL (your PostgreSQL connection string)
# - NEXTAUTH_SECRET (generated above)
# - OPENAI_API_KEY (from platform.openai.com)
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed with demo data (optional)
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Demo Account

If you seeded the database:
- Email: `demo@example.com`
- Password: `demo123`

## Automated Setup

### Linux/macOS

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Windows

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
```

## Minimum .env Configuration

```env
DATABASE_URL="postgresql://user:password@localhost:5432/career_copilot"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"
OPENAI_API_KEY="sk-your-key"
```

## Cloud Database Options

### Supabase (Free)
1. Create project at [supabase.com](https://supabase.com)
2. Copy connection string from Settings > Database
3. Use as DATABASE_URL

### Railway (Free)
1. Install CLI: `npm i -g @railway/cli`
2. Run: `railway login && railway init`
3. Add PostgreSQL: `railway add postgresql`
4. Connection string is auto-set

## Getting OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/Login
3. Navigate to API Keys
4. Create new secret key
5. Add $5+ credits in Billing

## Next Steps

- Read [SETUP.md](SETUP.md) for detailed configuration
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Troubleshooting

### "Cannot connect to database"
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### "OpenAI API error"
- Verify OPENAI_API_KEY is correct
- Check you have credits at platform.openai.com
- Ensure API key has proper permissions

### "NextAuth error"
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Ensure all OAuth credentials are correct (if using)

## Support

- 📖 [Full Documentation](SETUP.md)
- 🐛 [Report Issues](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)
