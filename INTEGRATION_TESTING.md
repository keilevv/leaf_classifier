# Integration Testing Guide

This guide explains how to run integration tests to verify all services are connected correctly in Docker.

## Overview

Integration tests verify that:
- All Docker containers are running and healthy
- Services can communicate with each other
- API endpoints work end-to-end
- Database connectivity is working
- Cross-service workflows function correctly

## Quick Start

### 1. Start Docker Services

```bash
# For development
docker-compose up -d

# For production
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Wait for Services to Be Ready

```bash
# Wait for services to start (usually 15-30 seconds)
sleep 20

# Or use the helper script
cd backend
./scripts/run-integration-tests.sh
```

### 3. Run Integration Tests

```bash
cd backend

# Run all integration tests
bun test:integration

# Or use the script (handles service startup)
./scripts/run-integration-tests.sh
```

## Test Suites

### Service Connectivity Tests
Tests that all services are accessible:

```bash
bun test:integration:services
```

**What it tests:**
- Backend API is responding
- Classifier service is accessible
- Database connection works
- Frontend is serving content

### API Integration Tests
Tests API endpoints with real services:

```bash
bun test:integration:api
```

**What it tests:**
- Authentication (register, login, token refresh)
- Plant classification endpoints
- Species management
- User profile management
- End-to-end workflows

### Docker Health Checks
Tests Docker container status:

```bash
bun test:integration:health
```

**What it tests:**
- All required containers are running
- Containers are on the same network
- Health checks are passing
- Ports are accessible

## Configuration

### Environment Variables

Set these in your shell or `.env` file:

```bash
# Service URLs (defaults shown)
export INTEGRATION_BACKEND_URL=http://localhost:5000
export INTEGRATION_CLASSIFIER_URL=http://localhost:8000
export INTEGRATION_FRONTEND_URL=http://localhost:5173

# Database (optional, for direct DB tests)
export INTEGRATION_DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Test credentials
export TEST_ADMIN_EMAIL=adminleaf@yopmail.com
export TEST_ADMIN_PASSWORD=admin123

# Timeouts
export INTEGRATION_REQUEST_TIMEOUT=10000
export INTEGRATION_STARTUP_TIMEOUT=30000
```

### Production Testing

To test against production services:

```bash
export INTEGRATION_BACKEND_URL=https://your-domain.com/api
export INTEGRATION_CLASSIFIER_URL=http://classifier:8000  # Internal Docker network
export INTEGRATION_FRONTEND_URL=https://your-domain.com

bun test:integration
```

## Running Specific Tests

### Test Authentication Only

```bash
bun test src/__tests__/integration/api/auth.integration.test.ts
```

### Test Classifier Service

```bash
bun test src/__tests__/integration/api/classifier.integration.test.ts
```

### Test End-to-End Workflows

```bash
bun test src/__tests__/integration/api/end-to-end.integration.test.ts
```

## Troubleshooting

### Services Not Accessible

**Problem:** Tests fail with `ECONNREFUSED` or `ETIMEDOUT`

**Solutions:**
1. Verify containers are running:
   ```bash
   docker ps --filter "name=leaf-"
   ```

2. Check service logs:
   ```bash
   docker logs leaf-backend
   docker logs leaf-classifier
   docker logs leaf-db
   ```

3. Verify network connectivity:
   ```bash
   docker network inspect leaf-network
   ```

4. Test manually:
   ```bash
   curl http://localhost:5000
   curl http://localhost:8000
   ```

### Database Connection Issues

**Problem:** Database tests fail

**Solutions:**
1. Check database container:
   ```bash
   docker exec -it leaf-db psql -U leafuser -d leafapp -c "SELECT 1;"
   ```

2. Verify DATABASE_URL:
   ```bash
   echo $DATABASE_URL
   ```

3. Check database health:
   ```bash
   docker inspect leaf-db --format '{{.State.Health.Status}}'
   ```

### Test Timeouts

**Problem:** Tests timeout before completing

**Solutions:**
1. Increase timeout values:
   ```bash
   export INTEGRATION_REQUEST_TIMEOUT=30000
   ```

2. Check if services are slow to respond:
   ```bash
   time curl http://localhost:5000
   ```

3. Check resource usage:
   ```bash
   docker stats
   ```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Integration Tests

on: [push, pull_request]

jobs:
  integration-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Start Docker services
        run: docker-compose -f docker-compose.prod.yml up -d
      
      - name: Wait for services
        run: sleep 30
      
      - name: Run integration tests
        run: |
          cd backend
          bun install
          bun test:integration
        env:
          INTEGRATION_BACKEND_URL: http://localhost:5000
          INTEGRATION_CLASSIFIER_URL: http://localhost:8000
      
      - name: Show logs on failure
        if: failure()
        run: |
          docker-compose -f docker-compose.prod.yml logs
```

## Test Data Management

### Automatic Cleanup

By default, tests clean up created data. To disable:

```bash
export INTEGRATION_CLEANUP=false
```

### Manual Cleanup

If tests fail and leave test data:

```bash
# Connect to database
docker exec -it leaf-db psql -U leafuser -d leafapp

# Remove test users
DELETE FROM "User" WHERE email LIKE 'test-%@example.com';
DELETE FROM "User" WHERE email LIKE 'e2e-test-%@example.com';

# Remove test species
DELETE FROM "Species" WHERE "scientificName" LIKE 'Test Species%';
```

## Best Practices

1. **Run tests after deployment** to verify services are working
2. **Run tests before merging** to catch integration issues early
3. **Use unique test data** (timestamps in emails/names)
4. **Clean up test data** after test runs
5. **Monitor test execution time** to catch performance issues

## Next Steps

After integration tests pass:
1. ✅ All services are connected
2. ✅ APIs are working correctly
3. ✅ Database is accessible
4. ✅ Cross-service communication works

You can now:
- Deploy to production with confidence
- Monitor services for issues
- Run these tests in CI/CD pipelines

