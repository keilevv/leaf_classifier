#!/bin/bash

# Integration Test Runner Script
# Runs integration tests against Docker services

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if services are running
print_status "Checking if Docker services are running..."

if ! docker ps --format '{{.Names}}' | grep -q "leaf-backend"; then
    print_warning "Docker services don't appear to be running."
    print_status "Attempting to start services..."
    
    # Try to start services
    if [ -f "../../docker-compose.prod.yml" ]; then
        docker-compose -f ../../docker-compose.prod.yml up -d
    elif [ -f "../../docker-compose.yml" ]; then
        docker-compose -f ../../docker-compose.yml up -d
    else
        print_error "Could not find docker-compose file. Please start services manually."
        exit 1
    fi
    
    print_status "Waiting for services to be ready..."
    sleep 15
fi

# Wait for services to be healthy
print_status "Waiting for services to be ready..."

MAX_WAIT=60
WAIT_TIME=0

while [ $WAIT_TIME -lt $MAX_WAIT ]; do
    if curl -s http://localhost:5000 > /dev/null 2>&1; then
        print_success "Backend is ready"
        break
    fi
    sleep 2
    WAIT_TIME=$((WAIT_TIME + 2))
    echo -n "."
done

if [ $WAIT_TIME -ge $MAX_WAIT ]; then
    print_error "Backend service did not become ready in time"
    exit 1
fi

# Set default environment variables if not set
export INTEGRATION_BACKEND_URL=${INTEGRATION_BACKEND_URL:-"http://localhost:5000"}
export INTEGRATION_CLASSIFIER_URL=${INTEGRATION_CLASSIFIER_URL:-"http://localhost:8000"}
export INTEGRATION_FRONTEND_URL=${INTEGRATION_FRONTEND_URL:-"http://localhost:5173"}

print_status "Running integration tests..."
print_status "Backend URL: $INTEGRATION_BACKEND_URL"
print_status "Classifier URL: $INTEGRATION_CLASSIFIER_URL"
print_status "Frontend URL: $INTEGRATION_FRONTEND_URL"

# Run tests
cd "$(dirname "$0")/.."
bun test src/__tests__/integration

print_success "Integration tests completed!"

