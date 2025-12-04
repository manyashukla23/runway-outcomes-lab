#!/bin/bash
# Setup database script - run this manually if needed

echo "Setting up PostgreSQL database..."

# Try to connect and create user/database
# You may need to adjust the connection string based on your PostgreSQL setup

PGPASSWORD=${PGPASSWORD:-""} psql -U postgres <<EOF 2>/dev/null || psql -d postgres <<EOF
CREATE USER thelook_user WITH PASSWORD 'thelook_password';
CREATE DATABASE thelook OWNER thelook_user;
GRANT ALL PRIVILEGES ON DATABASE thelook TO thelook_user;
\q
EOF

echo "Database setup complete!"
echo ""
echo "If you got errors, you may need to:"
echo "1. Connect as postgres superuser: psql -U postgres"
echo "2. Or use: sudo -u postgres psql"
echo "3. Then run the CREATE USER and CREATE DATABASE commands manually"

