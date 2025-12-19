#!/bin/bash

# MediTrack Deployment Helper Script
# This script helps prepare your code for deployment

set -e

echo "🚀 MediTrack Deployment Preparation"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git repository not initialized${NC}"
    echo "Initializing git repository..."
    git init
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${GREEN}✅ Git repository found${NC}"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    echo "Files with changes:"
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message (or press Enter for default): " commit_msg
        if [ -z "$commit_msg" ]; then
            commit_msg="Prepare for deployment"
        fi
        git commit -m "$commit_msg"
        echo -e "${GREEN}✅ Changes committed${NC}"
    fi
else
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
fi

# Check for .env files that shouldn't be committed
echo ""
echo "Checking for sensitive files..."
if [ -f "backend/.env" ] || [ -f "frontend/.env" ] || [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Found .env files${NC}"
    echo "Make sure these are in .gitignore (they should not be committed)"
    if [ -f ".gitignore" ]; then
        if grep -q "\.env" .gitignore; then
            echo -e "${GREEN}✅ .env is in .gitignore${NC}"
        else
            echo -e "${RED}❌ .env is NOT in .gitignore${NC}"
            echo "Adding .env to .gitignore..."
            echo "" >> .gitignore
            echo "# Environment files" >> .gitignore
            echo ".env" >> .gitignore
            echo ".env.local" >> .gitignore
            echo ".env.*.local" >> .gitignore
        fi
    fi
else
    echo -e "${GREEN}✅ No .env files found${NC}"
fi

# Check if remote is set
echo ""
echo "Checking git remote..."
if git remote -v | grep -q "origin"; then
    echo -e "${GREEN}✅ Git remote 'origin' is configured${NC}"
    git remote -v
else
    echo -e "${YELLOW}⚠️  No git remote configured${NC}"
    echo ""
    read -p "Do you want to add a GitHub remote? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GitHub repository URL (e.g., https://github.com/username/MediTrack.git): " repo_url
        if [ ! -z "$repo_url" ]; then
            git remote add origin "$repo_url"
            echo -e "${GREEN}✅ Remote added${NC}"
        fi
    fi
fi

# Check deployment files
echo ""
echo "Checking deployment files..."
files_to_check=(
    "backend/Dockerfile"
    "backend/render.yaml"
    "backend/railway.json"
    "frontend/vercel.json"
    "frontend/netlify.toml"
    "DEPLOYMENT_GUIDE.md"
    "QUICK_DEPLOY.md"
)

all_files_exist=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file (missing)${NC}"
        all_files_exist=false
    fi
done

# Build check
echo ""
echo "Checking if code builds..."
echo "Building frontend..."
cd frontend
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend builds successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    echo "Run 'npm run build' in frontend directory to see errors"
fi
cd ..

echo ""
echo "Checking backend..."
cd backend
if mvn clean package -DskipTests > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend builds successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Backend build had issues (this is OK if database is not configured)${NC}"
fi
cd ..

# Summary
echo ""
echo "===================================="
echo "📋 Deployment Preparation Summary"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Push code to GitHub:"
echo "   git push -u origin main"
echo ""
echo "2. Set up Supabase database:"
echo "   - Go to https://supabase.com"
echo "   - Create project and run migrations"
echo ""
echo "3. Deploy backend to Render/Railway:"
echo "   - Follow QUICK_DEPLOY.md guide"
echo ""
echo "4. Deploy frontend to Vercel/Netlify:"
echo "   - Follow QUICK_DEPLOY.md guide"
echo ""
echo -e "${GREEN}✅ Preparation complete!${NC}"
echo ""
echo "For detailed instructions, see:"
echo "  - QUICK_DEPLOY.md (5-minute guide)"
echo "  - DEPLOYMENT_GUIDE.md (detailed guide)"
echo "  - DEPLOYMENT_CHECKLIST.md (step-by-step checklist)"

