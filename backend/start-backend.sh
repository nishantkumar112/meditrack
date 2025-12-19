#!/bin/bash

echo "🚀 Starting MediTrack Backend..."
echo ""

cd "$(dirname "$0")"

# Load environment variables from .env file
if [ -f .env ]; then
    echo "📝 Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
    echo "✅ Environment variables loaded"
else
    echo "⚠️  Warning: .env file not found. Using defaults."
fi

# Ensure database exists
echo ""
echo "🔍 Verifying database connection..."
./ensure-database.sh

# Start backend
echo ""
echo "🎯 Starting Spring Boot application..."
echo "   Database: ${DB_URL:-jdbc:postgresql://localhost:5433/meditrack}"
echo "   Server: http://localhost:8080"
echo ""
mvn spring-boot:run

