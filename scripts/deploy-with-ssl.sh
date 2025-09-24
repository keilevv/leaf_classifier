#!/bin/bash

# Universal SSL deployment script for Leaf Classifier
# Usage: ./scripts/deploy-with-ssl.sh [TYPE] [ADDRESS] [EMAIL]
# Types: ip, domain
# Examples:
#   ./scripts/deploy-with-ssl.sh ip 192.168.1.100
#   ./scripts/deploy-with-ssl.sh domain myapp.example.com admin@example.com

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🍃 Leaf Classifier SSL Deployment${NC}"
echo "====================================="

# Parse arguments
DEPLOYMENT_TYPE=$1
ADDRESS=$2
EMAIL=$3

# Validation
if [ -z "$DEPLOYMENT_TYPE" ]; then
    echo -e "${RED}❌ Error: Deployment type is required${NC}"
    echo ""
    echo -e "${BLUE}Usage:${NC}"
    echo "  $0 ip <IP_ADDRESS>"
    echo "  $0 domain <DOMAIN_NAME> [EMAIL]"
    echo ""
    echo -e "${BLUE}Examples:${NC}"
    echo "  $0 ip 192.168.1.100"
    echo "  $0 domain myapp.example.com admin@example.com"
    exit 1
fi

if [ "$DEPLOYMENT_TYPE" != "ip" ] && [ "$DEPLOYMENT_TYPE" != "domain" ]; then
    echo -e "${RED}❌ Error: Invalid deployment type. Must be 'ip' or 'domain'${NC}"
    exit 1
fi

if [ -z "$ADDRESS" ]; then
    echo -e "${RED}❌ Error: Address is required${NC}"
    if [ "$DEPLOYMENT_TYPE" = "ip" ]; then
        echo "For IP deployment: $0 ip <IP_ADDRESS>"
    else
        echo "For domain deployment: $0 domain <DOMAIN_NAME> [EMAIL]"
    fi
    exit 1
fi

# Change to project directory
cd "$PROJECT_ROOT"

# Deploy based on type
if [ "$DEPLOYMENT_TYPE" = "ip" ]; then
    echo -e "${BLUE}🔐 Deploying with IP-based SSL...${NC}"
    echo -e "${YELLOW}📍 IP Address: $ADDRESS${NC}"
    echo ""
    
    # Call IP deployment script
    ./scripts/deploy-ssl-ip.sh "$ADDRESS"
    
elif [ "$DEPLOYMENT_TYPE" = "domain" ]; then
    echo -e "${BLUE}🔐 Deploying with domain-based SSL...${NC}"
    echo -e "${YELLOW}🌐 Domain: $ADDRESS${NC}"
    if [ -n "$EMAIL" ]; then
        echo -e "${YELLOW}📧 Email: $EMAIL${NC}"
    else
        echo -e "${YELLOW}📧 Email: admin@$ADDRESS (default)${NC}"
    fi
    echo ""
    
    # Call domain deployment script
    ./scripts/deploy-ssl-domain.sh "$ADDRESS" "$EMAIL"
fi

echo ""
echo -e "${GREEN}🎉 SSL deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📚 For more information, see: SSL-DEPLOYMENT.md${NC}"
