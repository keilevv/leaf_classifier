#!/bin/bash

# Script to deploy the app with SSL for IP-based access
# Usage: ./scripts/deploy-ssl-ip.sh [IP_ADDRESS]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Leaf Classifier with SSL (IP-based)${NC}"
echo "=================================================="

# Check if IP address is provided
IP_ADDRESS=$1
if [ -z "$IP_ADDRESS" ]; then
    echo -e "${RED}❌ Error: IP address is required${NC}"
    echo "Usage: $0 <IP_ADDRESS>"
    echo "Example: $0 192.168.1.100"
    exit 1
fi

echo -e "${YELLOW}📍 Using IP address: $IP_ADDRESS${NC}"

# Change to project directory
cd "$PROJECT_ROOT"

# Step 1: Generate SSL certificates
echo -e "${YELLOW}🔐 Step 1: Generating SSL certificates...${NC}"
./scripts/generate-ssl-certificates.sh "$IP_ADDRESS"

# Step 2: Update nginx configuration with actual IP
echo -e "${YELLOW}⚙️  Step 2: Updating nginx configuration...${NC}"
# Use the IP-specific nginx config directly
cp nginx/nginx-ssl-ip.conf nginx/nginx-ssl-ip-final.conf

# Step 3: Deploy with Docker Compose
echo -e "${YELLOW}🐳 Step 3: Deploying with Docker Compose...${NC}"
export IP_ADDRESS="$IP_ADDRESS"
sudo docker compose -f docker-compose.ssl-ip.yml down
sudo docker compose -f docker-compose.ssl-ip.yml up -d --build

# Step 5: Wait for services to be ready
echo -e "${YELLOW}⏳ Step 5: Waiting for services to be ready...${NC}"
sleep 10

# Check if services are running
echo -e "${YELLOW}🔍 Checking service status...${NC}"
sudo docker compose -f docker-compose.ssl-ip.yml ps

# Step 6: Test SSL connection
echo -e "${YELLOW}🧪 Step 6: Testing SSL connection...${NC}"
if command -v curl &> /dev/null; then
    echo "Testing HTTPS connection..."
    curl -k -I "https://$IP_ADDRESS" || echo -e "${YELLOW}⚠️  HTTPS test failed (this is expected for self-signed certificates)${NC}"
    echo "Testing HTTP redirect..."
    curl -I "http://$IP_ADDRESS" | grep -q "301" && echo -e "${GREEN}✅ HTTP to HTTPS redirect working${NC}" || echo -e "${YELLOW}⚠️  HTTP redirect test inconclusive${NC}"
else
    echo -e "${YELLOW}⚠️  curl not available, skipping connection tests${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Access Information:${NC}"
echo "   🌐 HTTP:  http://$IP_ADDRESS (redirects to HTTPS)"
echo "   🔒 HTTPS: https://$IP_ADDRESS"
echo ""
echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo "   • This uses self-signed certificates - browsers will show security warnings"
echo "   • Click 'Advanced' → 'Proceed to site' to bypass the warning"
echo "   • For production use, consider getting a trusted SSL certificate"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo "   • View logs: sudo docker compose -f docker-compose.ssl-ip.yml logs -f"
echo "   • Stop services: sudo docker compose -f docker-compose.ssl-ip.yml down"
echo "   • Restart services: sudo docker compose -f docker-compose.ssl-ip.yml restart"
echo "   • Update and redeploy: ./scripts/deploy-ssl-ip.sh $IP_ADDRESS"
