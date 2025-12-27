#!/bin/bash

# ============================================
# BlueMoon Quick Setup Script
# IT4082-BlueMoon-Nhom18
# ============================================

echo "========================================="
echo "🌙 BlueMoon Apartment Manager - Setup"
echo "========================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if node_modules exist, if not install dependencies
echo -e "${YELLOW}📦 Checking dependencies...${NC}"

if [ ! -d "backend/node_modules" ]; then
  echo -e "${BLUE}Installing backend dependencies...${NC}"
  cd backend && npm install && cd ..
else
  echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi

if [ ! -d "frontend/node_modules" ]; then
  echo -e "${BLUE}Installing frontend dependencies...${NC}"
  cd frontend && npm install && cd ..
else
  echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

# Create backend .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
  echo -e "${BLUE}Creating backend .env file...${NC}"
  cat <<EOT > backend/.env
NODE_ENV=development
PORT=5000
DB_HOST=dingleberries.ddns.net
DB_NAME=bluemoon_db
DB_USER=postgres
DB_PASSWORD=98tV2v_!pT*:nuc>
DB_PORT=5432
JWT_SECRET=a_very_long_and_random_secret_string_for_your_app_12345!@#$%
JWT_EXPIRES_IN=1h
EOT
fi

# Create frontend .env if it doesn't exist
if [ ! -f "frontend/.env" ]; then
  echo -e "${BLUE}Creating frontend .env file...${NC}"
  echo "VITE_API_BASE_URL=http://localhost:5000/api" > frontend/.env
fi

echo ""
echo -e "${YELLOW}🚀 Starting servers...${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
  echo ""
  echo -e "${YELLOW}Shutting down servers...${NC}"
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  exit 0
}

# Ensure demo users exist
echo -e "${YELLOW}👤 Checking/Creating demo accounts...${NC}"
cd backend && node create-demo-users.js && cd ..

trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${BLUE}Starting Backend (Express.js)...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo -e "${BLUE}Starting Frontend (Vite + React)...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================="
echo -e "${GREEN}✓ BlueMoon is running!${NC}"
echo "========================================="
echo ""
echo -e "  ${BLUE}Frontend:${NC} http://localhost:5173"
echo -e "  ${BLUE}Backend:${NC}  http://localhost:5000/api"
echo ""
echo -e "  ${YELLOW}Login:${NC}"
echo "    Username: admin123"
echo "    Password: admin123"
echo ""
echo "  Press Ctrl+C to stop both servers"
echo "========================================="

# Wait for both processes
wait
