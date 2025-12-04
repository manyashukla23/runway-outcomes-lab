#!/usr/bin/env python3
"""Test database connection"""
import sys
from sqlalchemy import create_engine, text

# Try different connection strings
connection_strings = [
    "postgresql://postgres@localhost:5432/thelook",
    "postgresql://localhost:5432/thelook",
    "postgresql://postgres@localhost:5432/postgres",  # Try connecting to postgres DB first
]

print("Testing database connections...\n")

for conn_str in connection_strings:
    print(f"Trying: {conn_str.split('@')[0]}@...")
    try:
        engine = create_engine(conn_str, connect_args={"connect_timeout": 2})
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ SUCCESS! Connected to: {version.split(',')[0]}\n")
            sys.exit(0)
    except Exception as e:
        print(f"❌ Failed: {str(e)[:100]}\n")

print("\n⚠️  Could not connect to database.")
print("\nPlease ensure:")
print("1. PostgreSQL is running")
print("2. Database 'thelook' exists")
print("3. User 'thelook_user' exists with password 'thelook_password'")
print("\nTo create them, run:")
print("  psql -d postgres")
print("  CREATE USER thelook_user WITH PASSWORD 'thelook_password';")
print("  CREATE DATABASE thelook OWNER thelook_user;")

