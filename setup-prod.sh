#!/bin/bash

# Production Setup Script for Leaf Classifier
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Setting up production environment for Leaf Classifier..."

# Check if production env files already exist
if [ -f ".env.prod" ] || [ -f "backend/.env.prod" ]; then
    print_warning "Production environment files already exist!"
    read -p "Do you want to overwrite them? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Setup cancelled."
        exit 0
    fi
fi

# Get production domain from user
print_status "Please provide your production domain information:"
read -p "Enter your production domain (e.g., myapp.com): " PROD_DOMAIN

if [ -z "$PROD_DOMAIN" ]; then
    print_error "Domain is required!"
    exit 1
fi

# Update .env.prod with actual domain
print_status "Updating .env.prod with your domain: $PROD_DOMAIN"
sed -i "s/129.153.122.159/$PROD_DOMAIN/g" .env.prod
sed -i "s/129.153.122.159/$PROD_DOMAIN/g" backend/.env.prod
sed -i "s/129.153.122.159/$PROD_DOMAIN/g" frontend/.env.prod

print_success "Production environment files configured!"
echo ""
print_warning "IMPORTANT: Please review and update the following in your .env.prod files:"
echo ""
print_warning "1. Change all 'your_very_secure_*_secret_here' to actual secure secrets"
print_warning "2. Update Google OAuth callback URL if needed"
print_warning "3. Verify email configuration"
print_warning "4. Update Bold payment configuration if needed"
echo ""
print_status "Files to review:"
print_status "  - .env.prod"
print_status "  - backend/.env.prod"
print_status "  - frontend/.env.prod"
echo ""
print_status "After reviewing, run: ./deploy.sh"

