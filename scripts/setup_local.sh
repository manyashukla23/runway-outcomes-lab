#!/bin/bash
# Setup script for running without Docker

echo "Setting up local development environment..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install it first:"
    echo "  macOS: brew install postgresql@16"
    echo "  Then: brew services start postgresql@16"
    exit 1
fi

# Create database and user
echo "Creating database and user..."
psql postgres -c "CREATE USER thelook_user WITH PASSWORD 'thelook_password';" 2>/dev/null || echo "User may already exist"
psql postgres -c "CREATE DATABASE thelook OWNER thelook_user;" 2>/dev/null || echo "Database may already exist"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE thelook TO thelook_user;" 2>/dev/null

echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Install backend dependencies:"
echo "   cd backend && pip install -e ."
echo ""
echo "2. Set DATABASE_URL environment variable:"
echo "   export DATABASE_URL='postgresql://thelook_user:thelook_password@localhost:5432/thelook'"
echo ""
echo "3. Load the data:"
echo "   python -m app.etl.load_thelook_csvs"
echo ""
echo "4. Start the backend:"
echo "   uvicorn app.main:app --reload"

