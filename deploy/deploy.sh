#!/bin/bash
set -e

echo "=== ChinaPrice Deployment ==="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo "ERROR: .env file not found. Copy .env.example to .env and fill in your keys."
    exit 1
fi

echo "[1/4] Building Docker images..."
cd "$SCRIPT_DIR"
docker compose -f docker-compose.prod.yml build

echo ""
echo "[2/4] Starting infrastructure services..."
docker compose -f docker-compose.prod.yml up -d postgres redis elasticsearch
echo "Waiting for services to be healthy..."
sleep 15

echo ""
echo "[3/4] Starting application services..."
docker compose -f docker-compose.prod.yml up -d backend celery-worker celery-beat frontend

echo ""
echo "[4/4] Starting nginx reverse proxy..."
docker compose -f docker-compose.prod.yml up -d nginx

echo ""
echo "=== Deployment complete ==="
echo "Application is available at http://localhost"
echo ""
echo "Useful commands:"
echo "  View logs:    docker compose -f deploy/docker-compose.prod.yml logs -f"
echo "  Stop all:     docker compose -f deploy/docker-compose.prod.yml down"
echo "  Restart:      docker compose -f deploy/docker-compose.prod.yml restart"
echo "  Health check: curl http://localhost/health"
