-- SQL script to create the database and user
-- Run this with: psql -d postgres -f scripts/create_db.sql
-- Or copy-paste these commands into psql

CREATE USER thelook_user WITH PASSWORD 'thelook_password';
CREATE DATABASE thelook OWNER thelook_user;
GRANT ALL PRIVILEGES ON DATABASE thelook TO thelook_user;

-- Verify it was created
\l thelook

