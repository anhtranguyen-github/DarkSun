#!/bin/bash

echo "🚀 Starting BlueMoon in Docker..."

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running or not accessible."
  echo "   - If on Windows/WSL: Open Docker Desktop > Settings > Resources > WSL Integration > Enable for your distro."
  echo "   - If on Linux: Ensure docker service is started."
  exit 1
fi

# Try modern 'docker compose' first, fallback to 'docker-compose'
if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
else
    echo "❌ Error: 'docker compose' is not installed."
    exit 1
fi

echo "Using command: $COMPOSE_CMD"
$COMPOSE_CMD up --build -d

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Application is running!"
    echo "   👉 Frontend: http://localhost:3000"
    echo "   👉 Backend:  http://localhost:5000"
    echo ""
    echo "To stop: $COMPOSE_CMD down"
else
    echo ""
    echo "❌ Failed to start containers."
fi
