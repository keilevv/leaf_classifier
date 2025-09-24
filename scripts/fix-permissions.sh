#!/bin/bash

# Quick fix script for permission issues
# Usage: ./scripts/fix-permissions.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Fixing Permissions${NC}"
echo "====================="

cd "$PROJECT_ROOT"

# Fix frontend dist directory permissions
echo -e "${YELLOW}📁 Fixing frontend dist directory permissions...${NC}"
if [ -d "frontend/dist" ]; then
    sudo rm -rf frontend/dist
fi
mkdir -p frontend/dist
chmod 755 frontend/dist

# Fix nginx ssl directory permissions
echo -e "${YELLOW}🔐 Fixing nginx SSL directory permissions...${NC}"
mkdir -p nginx/ssl/ip
mkdir -p nginx/ssl/domain
chmod -R 755 nginx/ssl/

# Fix ownership of project files
echo -e "${YELLOW}👤 Fixing project file ownership...${NC}"
sudo chown -R $USER:$USER .
chmod -R 755 .

# Fix specific permissions for key files
chmod 644 nginx/ssl/ip/*.crt 2>/dev/null || true
chmod 600 nginx/ssl/ip/*.key 2>/dev/null || true

echo -e "${GREEN}✅ Permissions fixed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Now you can retry the deployment:${NC}"
echo "   ./scripts/deploy-with-ssl.sh ip 129.153.122.159"
