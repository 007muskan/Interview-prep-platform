#!/bin/bash

echo "🚀 Setting up Career Intelligence Platform..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. You'll need a PostgreSQL database."
    echo "   Options:"
    echo "   1. Install locally: https://www.postgresql.org/download/"
    echo "   2. Use cloud database: Supabase, Railway, etc."
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your credentials before continuing"
    echo ""
    echo "Required:"
    echo "  - DATABASE_URL"
    echo "  - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    echo "  - OPENAI_API_KEY"
    echo ""
    echo "Optional (for OAuth):"
    echo "  - GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET"
    echo "  - GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Ask about database migration
echo ""
read -p "Do you want to run database migrations now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Running database migrations..."
    npx prisma migrate dev --name init
    
    # Ask about seeding
    read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🌱 Seeding database..."
        npx prisma db seed
        echo "✅ Database seeded with demo user (email: demo@example.com, password: demo123)"
    fi
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Make sure .env is configured with all required variables"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed setup instructions, see SETUP.md"
echo "For deployment guide, see DEPLOYMENT.md"
echo ""
