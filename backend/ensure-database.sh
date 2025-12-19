#!/bin/bash

# Script to ensure meditrack database exists before starting the backend

echo "Checking if meditrack database exists..."

# Check if database exists
DB_EXISTS=$(docker exec meditrack-postgres psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='meditrack'" 2>/dev/null)

if [ "$DB_EXISTS" != "1" ]; then
    echo "Database 'meditrack' does not exist. Creating it..."
    docker exec meditrack-postgres psql -U postgres -c "CREATE DATABASE meditrack;" 2>/dev/null
    echo "Database 'meditrack' created successfully!"
else
    echo "Database 'meditrack' already exists."
fi

echo "Verifying connection..."
docker exec meditrack-postgres psql -U postgres -d meditrack -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database connection verified!"
else
    echo "❌ Database connection failed!"
    exit 1
fi

