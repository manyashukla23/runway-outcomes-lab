#!/bin/bash
# Quick setup script - creates database and loads data

echo "🚀 Runway Outcomes Lab - Quick Setup"
echo "====================================="
echo ""

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw thelook; then
    echo "✅ Database 'thelook' already exists"
else
    echo "📦 Creating database..."
    echo ""
    echo "You'll need to connect to PostgreSQL. Try one of these:"
    echo ""
    echo "Option 1:"
    echo "  psql -d postgres"
    echo ""
    echo "Option 2 (if you have postgres user):"
    echo "  psql -U postgres -d postgres"
    echo ""
    echo "Then run these SQL commands:"
    echo "  CREATE USER thelook_user WITH PASSWORD 'thelook_password';"
    echo "  CREATE DATABASE thelook OWNER thelook_user;"
    echo "  GRANT ALL PRIVILEGES ON DATABASE thelook TO thelook_user;"
    echo "  \\q"
    echo ""
    read -p "Press Enter after you've created the database..."
fi

# Test connection
echo ""
echo "🔍 Testing database connection..."
export DATABASE_URL='postgresql://thelook_user:thelook_password@localhost:5432/thelook'

if python3 scripts/test_db_connection.py 2>&1 | grep -q "SUCCESS"; then
    echo "✅ Database connection successful!"
    echo ""
    echo "📥 Loading CSV data..."
    cd backend
    python3 -m app.etl.load_thelook_csvs
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Start backend: cd backend && export DATABASE_URL='postgresql://thelook_user:thelook_password@localhost:5432/thelook' && uvicorn app.main:app --reload"
    echo "2. Start frontend: cd frontend && npm run dev"
else
    echo "❌ Could not connect to database. Please check your PostgreSQL setup."
fi

