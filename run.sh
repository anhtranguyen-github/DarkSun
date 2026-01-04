#!/bin/bash

# =============================================================
# 🌙 BLUE MOON - UNIFIED SYSTEM LAUNCHER (v2.1)
# Works on: Ubuntu, Debian, WSL, macOS
# =============================================================

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
echo -e "${CYAN}${BOLD}=============================================================${NC}"
echo -e "${CYAN}${BOLD}   🌙  BLUE MOON - Apartment Management System${NC}"
echo -e "${CYAN}${BOLD}   📦  Version 2.1 - Business Logic Enhanced${NC}"
echo -e "${CYAN}${BOLD}=============================================================${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "Choose your deployment mode:"
echo -e "  [1] ${BOLD}Native${NC} (Runs via Node.js locally - Fast & Flexible)"
echo -e "  [2] ${BOLD}Docker${NC} (Isolated containers - Clean & Consistent)"
echo ""
read -p "Selection [1-2]: " mode

# --- PORT MANAGEMENT ---
kill_process_on_port() {
  local port=$1
  local pids=$(lsof -t -i:$port 2>/dev/null)
  if [ -n "$pids" ]; then
    echo -e "${YELLOW}   - Port $port is busy. Terminating stale processes...${NC}"
    kill -9 $pids 2>/dev/null || fuser -k $port/tcp > /dev/null 2>&1
  fi
}

# --- NATIVE STARTUP LOGIC ---
run_native() {
    echo -e "\n${CYAN}🔍 Analyzing environment for stale processes...${NC}"
    kill_process_on_port $BACKEND_PORT
    kill_process_on_port $FRONTEND_PORT

    echo -e "\n${YELLOW}📦 Validating dependencies...${NC}"
    
    # Check Backend
    if [ ! -d "backend/node_modules" ]; then
        echo -e "${BLUE}   Installing Backend dependencies...${NC}"
        cd backend && npm install --silent && cd ..
    else
        echo -e "${GREEN}   ✓ Backend dependencies OK${NC}"
    fi
    
    # Check Frontend
    if [ ! -d "frontend/node_modules" ]; then
        echo -e "${BLUE}   Installing Frontend dependencies...${NC}"
        cd frontend && npm install --silent && cd ..
    else
        echo -e "${GREEN}   ✓ Frontend dependencies OK${NC}"
    fi

    # Environment Setup
    if [ ! -f "backend/.env" ]; then
        echo -e "${BLUE}   Creating backend .env file...${NC}"
        cat <<EOT > backend/.env
NODE_ENV=development
PORT=$BACKEND_PORT
DB_HOST=dingleberries.ddns.net
DB_NAME=bluemoon_db
DB_USER=postgres
DB_PASSWORD=98tV2v_!pT*:nuc>
DB_PORT=5432
JWT_SECRET=bluemoon_ultra_secure_secret_2024
JWT_EXPIRES_IN=24h
EOT
    fi

    if [ ! -f "frontend/.env" ]; then
        echo "VITE_API_BASE_URL=http://localhost:$BACKEND_PORT/api" > frontend/.env
    fi

    echo -e "\n${YELLOW}🗄️  Synchronizing database...${NC}"
    cd backend
    if [ -f "scripts/seed-rbac.js" ]; then
        node scripts/seed-rbac.js > /dev/null 2>&1
    fi
    if [ -f "scripts/create-demo-users.js" ]; then
        node scripts/create-demo-users.js > /dev/null 2>&1
    fi
    if [ -f "scripts/seed-fee-types.js" ]; then
        node scripts/seed-fee-types.js > /dev/null 2>&1
    fi
    cd ..
    echo -e "${GREEN}   ✓ Database synced${NC}"

    # Cleanup Handler
    cleanup() {
        echo -e "\n\n${MAGENTA}🛑 Shutting down BlueMoon elegantly...${NC}"
        [ -n "$BACKEND_PID" ] && kill -TERM -$BACKEND_PID 2>/dev/null
        [ -n "$FRONTEND_PID" ] && kill -TERM -$FRONTEND_PID 2>/dev/null
        kill_process_on_port $BACKEND_PORT
        kill_process_on_port $FRONTEND_PORT
        echo -e "${GREEN}✨ Workspace clean. See you soon!${NC}"
        exit 0
    }
    trap cleanup SIGINT SIGTERM

    echo -e "\n${BOLD}${CYAN}🚀 LAUNCHING SERVICES...${NC}"
    
    cd backend
    npm run dev 2>&1 | sed 's/^/[BACKEND] /' &
    BACKEND_PID=$!
    cd ..
    
    sleep 3
    
    cd frontend
    npm run dev 2>&1 | sed 's/^/[FRONTEND] /' &
    FRONTEND_PID=$!
    cd ..

    echo -e "\n${GREEN}${BOLD}=============================================================${NC}"
    echo -e "${GREEN}${BOLD}   ✓ SYSTEM ONLINE - BLUE MOON IS READY${NC}"
    echo -e "${GREEN}${BOLD}=============================================================${NC}"
    echo -e "   Frontend: ${CYAN}http://localhost:$FRONTEND_PORT${NC}"
    echo -e "   Backend:  ${CYAN}http://localhost:$BACKEND_PORT/api${NC}"
    echo -e "   Health:   ${CYAN}http://localhost:$BACKEND_PORT/health${NC}"
    echo ""
    echo -e "   ${BOLD}Demo Accounts:${NC}"
    echo -e "   - Admin:      demo_admin / password123"
    echo -e "   - Manager:    demo_manager / password123"
    echo -e "   - Accountant: demo_accountant / password123"
    echo ""
    echo -e "   Press ${BOLD}Ctrl+C${NC} to stop all services."
    echo ""
    wait
}

# --- DOCKER STARTUP LOGIC ---
run_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Error: Docker is not running.${NC}"
        exit 1
    fi
    
    COMPOSE_CMD="docker compose"
    ! docker compose version >/dev/null 2>&1 && COMPOSE_CMD="docker-compose"

    echo -e "\n${GREEN}🐳 Starting BlueMoon via $COMPOSE_CMD...${NC}"
    $COMPOSE_CMD up --build -d
    
    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}✅ Application is running in Containers!${NC}"
        echo -e "   Frontend: http://localhost:3000"
        echo -e "   To stop:  $COMPOSE_CMD down"
    else
        echo -e "\n${RED}❌ Failed to start containers.${NC}"
    fi
}

case $mode in
    1) run_native ;;
    2) run_docker ;;
    *) echo -e "\nInvalid selection." ; exit 1 ;;
esac
