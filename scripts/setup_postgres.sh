#!/bin/bash
# Setup script using postgres user

echo "🚀 Setting up database with postgres user..."
echo ""

# Try to create database
echo "Creating database 'thelook'..."
psql -U postgres -d postgres -c "CREATE DATABASE thelook;" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully!"
else
    echo "⚠️  Database may already exist or you need to run manually:"
    echo "   psql -U postgres -d postgres"
    echo "   CREATE DATABASE thelook;"
    echo "   \\q"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Now you can load the data with:"
echo "  cd backend"
echo "  export DATABASE_URL='postgresql://postgres@localhost:5432/thelook'"
echo "  python3 -m app.etl.load_thelook_csvs"

