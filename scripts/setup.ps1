# PowerShell setup script for Windows

Write-Host "🚀 Setting up Career Intelligence Platform..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if PostgreSQL is installed
try {
    psql --version | Out-Null
} catch {
    Write-Host "⚠️  PostgreSQL not found. You'll need a PostgreSQL database." -ForegroundColor Yellow
    Write-Host "   Options:"
    Write-Host "   1. Install locally: https://www.postgresql.org/download/"
    Write-Host "   2. Use cloud database: Supabase, Railway, etc."
    Write-Host ""
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Cyan
    Copy-Item .env.example .env
    Write-Host "⚠️  Please update .env with your credentials before continuing" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Required:"
    Write-Host "  - DATABASE_URL"
    Write-Host "  - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    Write-Host "  - OPENAI_API_KEY"
    Write-Host ""
    Write-Host "Optional (for OAuth):"
    Write-Host "  - GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET"
    Write-Host "  - GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET"
    Write-Host ""
    Read-Host "Press Enter after updating .env file"
}

# Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

# Ask about database migration
Write-Host ""
$migrate = Read-Host "Do you want to run database migrations now? (y/n)"
if ($migrate -eq "y" -or $migrate -eq "Y") {
    Write-Host "🗄️  Running database migrations..." -ForegroundColor Cyan
    npx prisma migrate dev --name init
    
    # Ask about seeding
    $seed = Read-Host "Do you want to seed the database with sample data? (y/n)"
    if ($seed -eq "y" -or $seed -eq "Y") {
        Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
        npx prisma db seed
        Write-Host "✅ Database seeded with demo user (email: demo@example.com, password: demo123)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Make sure .env is configured with all required variables"
Write-Host "  2. Run 'npm run dev' to start the development server"
Write-Host "  3. Open http://localhost:3000 in your browser"
Write-Host ""
Write-Host "For detailed setup instructions, see SETUP.md"
Write-Host "For deployment guide, see DEPLOYMENT.md"
Write-Host ""
