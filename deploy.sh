#!/bin/bash

# Production Deployment Script for Leaf Classifier
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

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    print_error ".env.prod file not found!"
    print_warning "The .env.prod file has been created with your development values."
    print_warning "Please update the domain URLs in .env.prod for production:"
    print_warning "nano .env.prod"
    print_warning "Change '129.153.122.159' to your actual production domain"
    exit 1
fi

# Check if backend .env.prod exists
if [ ! -f "backend/.env.prod" ]; then
    print_error "backend/.env.prod file not found!"
    print_warning "The backend/.env.prod file has been created with your development values."
    print_warning "Please update the domain URLs in backend/.env.prod for production:"
    print_warning "nano backend/.env.prod"
    print_warning "Change '129.153.122.159' to your actual production domain"
    exit 1
fi

print_status "Starting production deployment..."

# Load environment variables
export $(cat .env.prod | grep -v '^#' | xargs)

# Build and start production services
print_status "Building production images..."
docker compose -f docker-compose.prod.yml build --no-cache

print_status "Starting production services..."
docker compose -f docker-compose.prod.yml up -d

print_status "Waiting for services to be healthy..."
sleep 10

# Check service health
print_status "Checking service health..."
docker compose -f docker-compose.prod.yml ps

print_success "Production deployment completed!"
echo ""
print_status "Services are running on:"
print_status "  - Frontend: http://localhost:${FRONTEND_PORT:-80}"
print_status "  - Backend: http://localhost:${BACKEND_PORT:-3000}"
print_status "  - Classifier: http://localhost:${CLASSIFIER_PORT:-5000}"
print_status "  - Postgres: localhost:${POSTGRES_PORT:-5432}"
echo ""
print_status "To view logs: docker compose -f docker-compose.prod.yml logs -f"
print_status "To stop: docker compose -f docker-compose.prod.yml down"
