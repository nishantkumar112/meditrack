#!/bin/bash

# GitHub Setup Helper Script
# Helps you set up GitHub repository for deployment

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📦 GitHub Repository Setup${NC}"
echo "=============================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
fi

# Add all files
echo "Adding files to git..."
git add .

# Check if there are changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
else
    echo "Files to be committed:"
    git status --short
    echo ""
    read -p "Enter commit message (or press Enter for default): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="Initial commit - MediTrack application"
    fi
    git commit -m "$commit_msg"
    echo -e "${GREEN}✅ Changes committed${NC}"
fi

# Check remote
if git remote -v | grep -q "origin"; then
    echo ""
    echo -e "${GREEN}✅ Remote 'origin' already exists:${NC}"
    git remote -v
    echo ""
    read -p "Do you want to change the remote URL? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter new GitHub repository URL: " repo_url
        git remote set-url origin "$repo_url"
        echo -e "${GREEN}✅ Remote URL updated${NC}"
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  No remote repository configured${NC}"
    echo ""
    echo "To add a remote repository:"
    echo "1. Create a new repository on GitHub (https://github.com/new)"
    echo "2. Copy the repository URL"
    echo "3. Run: git remote add origin <your-repo-url>"
    echo ""
    read -p "Do you want to add a remote now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter GitHub repository URL: " repo_url
        git remote add origin "$repo_url"
        echo -e "${GREEN}✅ Remote added${NC}"
    fi
fi

# Push to GitHub
if git remote -v | grep -q "origin"; then
    echo ""
    echo "Current branch: $(git branch --show-current)"
    echo ""
    read -p "Do you want to push to GitHub now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Check if branch exists remotely
        branch=$(git branch --show-current)
        if git ls-remote --heads origin "$branch" | grep -q "$branch"; then
            echo "Pushing to existing branch..."
            git push -u origin "$branch"
        else
            echo "Creating and pushing to new branch..."
            git push -u origin "$branch"
        fi
        echo -e "${GREEN}✅ Code pushed to GitHub!${NC}"
        echo ""
        echo "Your repository is now ready for deployment!"
        echo "Next steps:"
        echo "1. Go to https://supabase.com and create a database"
        echo "2. Go to https://render.com and deploy backend"
        echo "3. Go to https://vercel.com and deploy frontend"
        echo ""
        echo "See QUICK_DEPLOY.md for detailed instructions"
    fi
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"

