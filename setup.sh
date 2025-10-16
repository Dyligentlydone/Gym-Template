#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Setting up AI Web App Development Environment...${NC}"

# Frontend setup
echo -e "${GREEN}Setting up Frontend...${NC}"
cd frontend
npm install

# Backend setup
echo -e "${GREEN}Setting up Backend...${NC}"
cd ../backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${BLUE}To start development:${NC}"
echo "1. Frontend: cd frontend && npm run dev"
echo "2. Backend: cd backend && source venv/bin/activate && python app.py"
