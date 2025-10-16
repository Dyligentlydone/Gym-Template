#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to cleanup background processes on exit
cleanup() {
    echo -e "${BLUE}Shutting down servers...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup EXIT

echo -e "${BLUE}Starting Development Servers...${NC}"

# Start backend
echo -e "${GREEN}Starting Backend Server...${NC}"
cd backend
source venv/bin/activate
python app.py &

# Start frontend
echo -e "${GREEN}Starting Frontend Server...${NC}"
cd ../frontend
npm run dev &

# Wait for both servers to be ready
sleep 3

echo -e "${GREEN}Development servers are running!${NC}"
echo -e "${BLUE}Frontend:${NC} http://localhost:5173"
echo -e "${BLUE}Backend:${NC} http://localhost:5002"
echo -e "${BLUE}Press Ctrl+C to stop both servers${NC}"

# Keep script running until Ctrl+C
wait
