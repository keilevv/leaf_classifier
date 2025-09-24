#!/bin/bash

# Script to deploy the app with SSL for domain-based access using Let's Encrypt
# Usage: ./scripts/deploy-ssl-domain.sh [DOMAIN_NAME] [EMAIL]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Leaf Classifier with SSL (Domain-based)${NC}"
echo "========================================================"

# Check if domain name is provided
DOMAIN_NAME=$1
EMAIL=$2

if [ -z "$DOMAIN_NAME" ]; then
    echo -e "${RED}❌ Error: Domain name is required${NC}"
    echo "Usage: $0 <DOMAIN_NAME> [EMAIL]"
    echo "Example: $0 myapp.example.com admin@example.com"
    exit 1
fi

if [ -z "$EMAIL" ]; then
    echo -e "${YELLOW}⚠️  Warning: No email provided for Let's Encrypt${NC}"
    echo "Let's Encrypt recommends providing an email for important notifications"
    EMAIL="admin@$DOMAIN_NAME"
fi

echo -e "${YELLOW}📍 Using domain: $DOMAIN_NAME${NC}"
echo -e "${YELLOW}📧 Using email: $EMAIL${NC}"

# Change to project directory
cd "$PROJECT_ROOT"

# Step 1: Generate SSL certificates (for fallback)
echo -e "${YELLOW}🔐 Step 1: Generating fallback SSL certificates...${NC}"
./scripts/generate-ssl-certificates.sh "" "$DOMAIN_NAME"

# Step 2: Build frontend with Docker
echo -e "${YELLOW}🏗️  Step 2: Building frontend with Docker...${NC}"

# Build the frontend Docker image with domain URL
docker build -t leaf-frontend-domain \
    --build-arg VITE_API_URL="https://$DOMAIN_NAME/api" \
    -f frontend/Dockerfile.ssl-domain.prod \
    frontend/

# Step 3: Update nginx configuration with actual domain
echo -e "${YELLOW}⚙️  Step 3: Updating nginx configuration...${NC}"
sed "s/DOMAIN_NAME/$DOMAIN_NAME/g" nginx/nginx-ssl-domain.conf > nginx/nginx-ssl-domain-final.conf

# Step 4: Deploy initial setup (HTTP only for ACME challenge)
echo -e "${YELLOW}🐳 Step 4: Deploying initial setup...${NC}"
docker-compose -f docker-compose.ssl-domain.yml down

# Start services except nginx
docker-compose -f docker-compose.ssl-domain.yml up -d db backend classifier certbot

# Step 5: Get Let's Encrypt certificate
echo -e "${YELLOW}🔒 Step 5: Obtaining Let's Encrypt certificate...${NC}"
echo "This may take a few minutes..."

# Create temporary nginx config for ACME challenge
cat > nginx/nginx-acme-temp.conf << EOF
user  nginx;
worker_processes  auto;
events { worker_connections  1024; }
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name $DOMAIN_NAME;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 200 'ACME Challenge Server';
            add_header Content-Type text/plain;
        }
    }
}
EOF

# Start temporary nginx for ACME challenge
docker run -d --name temp-nginx \
    -p 80:80 \
    -v "$(pwd)/nginx/nginx-acme-temp.conf:/etc/nginx/nginx.conf:ro" \
    -v certbot_www:/var/www/certbot:ro \
    --network leaf_classifier_leaf-network \
    nginx:alpine

# Wait for nginx to be ready
sleep 5

# Obtain certificate
docker run --rm \
    -v certbot_www:/var/www/certbot \
    -v certbot_conf:/etc/letsencrypt \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN_NAME"

# Clean up temporary nginx
docker stop temp-nginx
docker rm temp-nginx
rm nginx/nginx-acme-temp.conf

# Step 6: Deploy full SSL setup
echo -e "${YELLOW}🔒 Step 6: Deploying full SSL setup...${NC}"
docker-compose -f docker-compose.ssl-domain.yml up -d

# Step 7: Wait for services to be ready
echo -e "${YELLOW}⏳ Step 7: Waiting for services to be ready...${NC}"
sleep 10

# Check if services are running
echo -e "${YELLOW}🔍 Checking service status...${NC}"
docker-compose -f docker-compose.ssl-domain.yml ps

# Step 8: Test SSL connection
echo -e "${YELLOW}🧪 Step 8: Testing SSL connection...${NC}"
if command -v curl &> /dev/null; then
    echo "Testing HTTPS connection..."
    curl -I "https://$DOMAIN_NAME" || echo -e "${YELLOW}⚠️  HTTPS test failed${NC}"
    echo "Testing HTTP redirect..."
    curl -I "http://$DOMAIN_NAME" | grep -q "301" && echo -e "${GREEN}✅ HTTP to HTTPS redirect working${NC}" || echo -e "${YELLOW}⚠️  HTTP redirect test inconclusive${NC}"
else
    echo -e "${YELLOW}⚠️  curl not available, skipping connection tests${NC}"
fi

# Step 9: Set up automatic certificate renewal
echo -e "${YELLOW}🔄 Step 9: Setting up automatic certificate renewal...${NC}"
cat > scripts/renew-ssl.sh << 'EOF'
#!/bin/bash
docker-compose -f docker-compose.ssl-domain.yml exec certbot certbot renew --quiet
docker-compose -f docker-compose.ssl-domain.yml exec nginx nginx -s reload
EOF

chmod +x scripts/renew-ssl.sh

# Add to crontab (runs twice daily)
(crontab -l 2>/dev/null; echo "0 12,0 * * * cd $(pwd) && ./scripts/renew-ssl.sh") | crontab -

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Access Information:${NC}"
echo "   🌐 HTTP:  http://$DOMAIN_NAME (redirects to HTTPS)"
echo "   🔒 HTTPS: https://$DOMAIN_NAME"
echo ""
echo -e "${GREEN}✅ Features Enabled:${NC}"
echo "   • Valid SSL certificate from Let's Encrypt"
echo "   • Automatic HTTP to HTTPS redirect"
echo "   • Automatic certificate renewal (twice daily)"
echo "   • Strong security headers"
echo "   • HTTP/2 support"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo "   • View logs: docker-compose -f docker-compose.ssl-domain.yml logs -f"
echo "   • Stop services: docker-compose -f docker-compose.ssl-domain.yml down"
echo "   • Restart services: docker-compose -f docker-compose.ssl-domain.yml restart"
echo "   • Renew certificates manually: ./scripts/renew-ssl.sh"
echo "   • Update and redeploy: ./scripts/deploy-ssl-domain.sh $DOMAIN_NAME $EMAIL"
echo ""
echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo "   • Make sure your domain $DOMAIN_NAME points to this server's IP address"
echo "   • Certificates will automatically renew before expiration"
echo "   • Check DNS propagation if you can't access the site immediately"
