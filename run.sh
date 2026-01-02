#!/bin/bash

# =============================================================
# 🌙 BlueMoon Unified Launcher
# Works on: Ubuntu, Debian, WSL, macOS
# =============================================================

GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

clear
echo -e "${CYAN}${BOLD}=============================================================${NC}"
echo -e "${CYAN}${BOLD}   🌙  BLUE MOON - UNIFIED SYSTEM LAUNCHER${NC}"
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

case $mode in
    1)
        echo -e "\n${GREEN}🚀 Launching Native environment...${NC}"
        bash ./start.sh
        ;;
    2)
        echo -e "\n${GREEN}🐳 Launching Docker containers...${NC}"
        bash ./docker-run.sh
        ;;
    *)
        echo -e "\nInvalid selection. Exiting."
        exit 1
        ;;
esac
