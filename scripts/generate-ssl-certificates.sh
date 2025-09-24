#!/bin/bash

# Script to generate SSL certificates for both IP and domain access
# Usage: ./scripts/generate-ssl-certificates.sh [IP_ADDRESS] [DOMAIN_NAME]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
NGINX_SSL_DIR="$PROJECT_ROOT/nginx/ssl"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 SSL Certificate Generation Script${NC}"
echo "======================================"

# Create SSL directories
mkdir -p "$NGINX_SSL_DIR/ip"
mkdir -p "$NGINX_SSL_DIR/domain"

# Function to generate self-signed certificate for IP
generate_ip_certificate() {
    local ip_address=$1
    
    if [ -z "$ip_address" ]; then
        echo -e "${RED}❌ Error: IP address is required for IP-based SSL certificate${NC}"
        echo "Usage: $0 <IP_ADDRESS> [DOMAIN_NAME]"
        exit 1
    fi
    
    echo -e "${YELLOW}📝 Generating self-signed certificate for IP: $ip_address${NC}"
    
    # Generate private key
    openssl genrsa -out "$NGINX_SSL_DIR/ip/leafapp.key" 2048
    
    # Generate certificate signing request
    openssl req -new -key "$NGINX_SSL_DIR/ip/leafapp.key" -out "$NGINX_SSL_DIR/ip/leafapp.csr" \
        -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=$ip_address"
    
    # Generate self-signed certificate
    openssl x509 -req -days 365 -in "$NGINX_SSL_DIR/ip/leafapp.csr" \
        -signkey "$NGINX_SSL_DIR/ip/leafapp.key" \
        -out "$NGINX_SSL_DIR/ip/leafapp.crt" \
        -extensions v3_req \
        -extfile <(
            echo "[v3_req]"
            echo "subjectAltName = @alt_names"
            echo "[alt_names]"
            echo "IP.1 = $ip_address"
            echo "DNS.1 = localhost"
        )
    
    # Clean up CSR file
    rm "$NGINX_SSL_DIR/ip/leafapp.csr"
    
    echo -e "${GREEN}✅ IP certificate generated successfully${NC}"
    echo "   Certificate: $NGINX_SSL_DIR/ip/leafapp.crt"
    echo "   Private Key: $NGINX_SSL_DIR/ip/leafapp.key"
}

# Function to setup Let's Encrypt certificate for domain
setup_domain_certificate() {
    local domain_name=$1
    
    if [ -z "$domain_name" ]; then
        echo -e "${YELLOW}⚠️  No domain provided. Skipping domain certificate setup.${NC}"
        return
    fi
    
    echo -e "${YELLOW}📝 Setting up Let's Encrypt certificate for domain: $domain_name${NC}"
    
    # Create a temporary nginx config for ACME challenge
    cat > "$NGINX_SSL_DIR/domain/acme-challenge.conf" << EOF
server {
    listen 80;
    server_name $domain_name;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF
    
    echo -e "${GREEN}✅ Domain certificate setup configuration created${NC}"
    echo "   ACME Challenge config: $NGINX_SSL_DIR/domain/acme-challenge.conf"
    echo ""
    echo -e "${BLUE}📋 Next steps for domain certificate:${NC}"
    echo "1. Point your domain $domain_name to this server's IP"
    echo "2. Run: sudo docker compose -f docker-compose.prod.yml up -d nginx-acme"
    echo "3. Run: sudo docker compose -f docker-compose.prod.yml exec certbot certonly --webroot -w /var/www/certbot -d $domain_name"
    echo "4. Run: sudo docker compose -f docker-compose.prod.yml up -d"
}

# Function to create dhparam file for stronger security
generate_dhparam() {
    echo -e "${YELLOW}🔒 Generating DH parameters (this may take a few minutes)...${NC}"
    
    if [ ! -f "$NGINX_SSL_DIR/dhparam.pem" ]; then
        openssl dhparam -out "$NGINX_SSL_DIR/dhparam.pem" 2048
        echo -e "${GREEN}✅ DH parameters generated${NC}"
    else
        echo -e "${BLUE}ℹ️  DH parameters already exist${NC}"
    fi
}

# Main execution
main() {
    local ip_address=$1
    local domain_name=$2
    
    # Check if OpenSSL is installed
    if ! command -v openssl &> /dev/null; then
        echo -e "${RED}❌ Error: OpenSSL is not installed. Please install it first.${NC}"
        exit 1
    fi
    
    # Generate certificates
    if [ -n "$ip_address" ]; then
        generate_ip_certificate "$ip_address"
    fi
    
    setup_domain_certificate "$domain_name"
    generate_dhparam
    
    echo ""
    echo -e "${GREEN}🎉 SSL certificate generation completed!${NC}"
    echo ""
    echo -e "${BLUE}📋 Summary:${NC}"
    if [ -n "$ip_address" ]; then
        echo "   ✅ IP-based certificate ready for: https://$ip_address"
    fi
    if [ -n "$domain_name" ]; then
        echo "   ✅ Domain certificate setup ready for: $domain_name"
    fi
    echo "   ✅ DH parameters generated for enhanced security"
    echo ""
    echo -e "${YELLOW}⚠️  Important Security Notes:${NC}"
    echo "   • Self-signed certificates will show security warnings in browsers"
    echo "   • For production, consider using Let's Encrypt for trusted certificates"
    echo "   • Keep your private keys secure and never commit them to version control"
}

# Run main function with all arguments
main "$@"
