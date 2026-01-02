#!/bin/bash

# ============================================
# BlueMoon Apartment Management System
# Production-Guided Setup & Startup Script
# ============================================

# Colors for premium terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Ports
BACKEND_PORT=5000
FRONTEND_PORT=5173

clear
echo -e "${MAGENTA}${BOLD}=============================================================${NC}"
echo -e "${MAGENTA}${BOLD}   🌙  BLUE MOON APARTMENT MANAGEMENT SYSTEM - V2.0${NC}"
echo -e "${MAGENTA}${BOLD}=============================================================${NC}"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# --- PORT MANAGEMENT & ZOMBIE CLEANUP ---
echo -e "${CYAN}🔍 Analyzing environment for stale processes...${NC}"

kill_process_on_port() {
  local port=$1
  local pids=$(lsof -t -i:$port)
  
  if [ -n "$pids" ]; then
    echo -e "${YELLOW}⚠️  Detected zombie/stale service on port $port (PID: $pids)${NC}"
    echo -e "${YELLOW}   Terminating to prevent startup conflicts...${NC}"
    
    # Try graceful kill first
    for pid in $pids; do
      kill -15 $pid 2>/dev/null
    done
    sleep 1
    
    # Force kill if still alive
    pids=$(lsof -t -i:$port)
    if [ -n "$pids" ]; then
      echo -e "${RED}   Forcefully purging port $port...${NC}"
      fuser -k $port/tcp > /dev/null 2>&1
    fi
    echo -e "${GREEN}   ✓ Port $port cleared${NC}"
  else
    echo -e "${CYAN}   ✓ Port $port is available${NC}"
  fi
}

kill_process_on_port $BACKEND_PORT
kill_process_on_port $FRONTEND_PORT

# --- DEPENDENCY CHECK ---
echo -e "\n${YELLOW}📦 Validating dependencies...${NC}"

check_node_modules() {
  local dir=$1
  local label=$2
  if [ ! -d "$dir/node_modules" ]; then
    echo -e "${BLUE}   Installing $label dependencies (this may take a minute)...${NC}"
    cd "$dir" && npm install --silent && cd ..
    echo -e "${GREEN}   ✓ $label dependencies installed${NC}"
  else
    echo -e "${GREEN}   ✓ $label dependencies verified${NC}"
  fi
}

check_node_modules "backend" "Backend"
check_node_modules "frontend" "Frontend"

# --- ENVIRONMENT CONFIGURATION ---
if [ ! -f "backend/.env" ]; then
  echo -e "\n${BLUE}📝 Generating backend .env configuration...${NC}"
  cat <<EOT > backend/.env
NODE_ENV=development
PORT=$BACKEND_PORT
DB_HOST=dingleberries.ddns.net
DB_NAME=bluemoon_db
DB_USER=postgres
DB_PASSWORD=98tV2v_!pT*:nuc>
DB_PORT=5432
JWT_SECRET=bluemoon_ultra_secure_secret_2024_dark_infinity
JWT_EXPIRES_IN=24h
EOT
fi

if [ ! -f "frontend/.env" ]; then
  echo -e "${BLUE}📝 Generating frontend .env configuration...${NC}"
  echo "VITE_API_BASE_URL=http://localhost:$BACKEND_PORT/api" > frontend/.env
fi

# --- DATABASE SEEDING ---
echo -e "\n${YELLOW}🗄️  Synchronizing database & Seeding data...${NC}"
cd backend
node scripts/seed-rbac.js > /dev/null 2>&1
node scripts/create-demo-users.js > /dev/null 2>&1
node scripts/seed-fee-types.js > /dev/null 2>&1
node scripts/seed-full-data.js > /dev/null 2>&1
cd ..
echo -e "${GREEN}   ✓ Database synchronized with full sample data${NC}"

# --- PROCESS CLEANUP HANDLER ---
cleanup() {
  echo -e "\n\n${MAGENTA}🛑 Shutting down BlueMoon elegantly...${NC}"
  # Kill process groups to ensure all children (nodemon/vite) die
  [ -n "$BACKEND_PID" ] && kill -TERM -$BACKEND_PID 2>/dev/null
  [ -n "$FRONTEND_PID" ] && kill -TERM -$FRONTEND_PID 2>/dev/null
  
  # Final sweep for specific ports just in case
  fuser -k $BACKEND_PORT/tcp > /dev/null 2>&1
  fuser -k $FRONTEND_PORT/tcp > /dev/null 2>&1
  
  echo -e "${GREEN}✨ Workspace clean. See you soon!${NC}"
  exit 0
}

trap cleanup SIGINT SIGTERM

# --- START SERVERS ---
echo -e "\n${BOLD}${CYAN}🚀 LAUNCHING SERVICES...${NC}"

# Start Backend
cd backend
npm run dev 2>&1 | sed 's/^/[BACKEND] /' &
BACKEND_PID=$!
cd ..

# Wait for backend to stabilize
sleep 2

# Start Frontend
cd frontend
npm run dev 2>&1 | sed 's/^/[FRONTEND] /' &
FRONTEND_PID=$!
cd ..

echo -e "\n${GREEN}${BOLD}=============================================================${NC}"
echo -e "${GREEN}${BOLD}   ✓ SYSTEM ONLINE - BLUE MOON IS READY${NC}"
echo -e "${GREEN}${BOLD}=============================================================${NC}"
echo ""
echo -e "   ${BOLD}Frontend:${NC}   ${CYAN}http://localhost:$FRONTEND_PORT${NC}"
echo -e "   ${BOLD}Backend:${NC}    ${CYAN}http://localhost:$BACKEND_PORT/api${NC}"
echo ""
echo -e "   ${BOLD}Master Admin Audit:${NC}"
echo -e "     User:     ${BOLD}admin123${NC}"
echo -e "     Pass:     ${BOLD}admin123${NC}"
echo ""
echo -e "   ${MAGENTA}Press Ctrl+C to terminate all services${NC}"
echo -e "${GREEN}${BOLD}=============================================================${NC}"

# Wait for both processes
wait
