# Integration Tests

Integration tests verify that all services work together correctly in a Docker environment. These tests connect to running services and test real interactions.

## Prerequisites

1. **Docker services must be running**:
   ```bash
   # For development
   docker-compose up -d
   
   # For production
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Environment variables** (optional, has defaults):
   - `BACKEND_URL` or `INTEGRATION_BACKEND_URL` - Backend API URL (default: http://localhost:5000)
   - `CLASSIFIER_URL` or `INTEGRATION_CLASSIFIER_URL` - Classifier service URL (default: http://localhost:8000)
   - `FRONTEND_URL` or `INTEGRATION_FRONTEND_URL` - Frontend URL (default: http://localhost:5173)
   - `DATABASE_URL` or `INTEGRATION_DATABASE_URL` - Database connection string (optional)
   - `TEST_ADMIN_EMAIL` - Admin email for tests (default: adminleaf@yopmail.com)
   - `TEST_ADMIN_PASSWORD` - Admin password (default: admin123)

## Running Integration Tests

### Run All Integration Tests

```bash
cd backend
bun test src/__tests__/integration
```

### Run Specific Test Suites

```bash
# Service connectivity tests
bun test src/__tests__/integration/services

# API integration tests
bun test src/__tests__/integration/api

# Docker health checks
bun test src/__tests__/integration/docker-health

# End-to-end workflows
bun test src/__tests__/integration/api/end-to-end
```

### Run Against Production Docker Services

```bash
# Set production URLs
export INTEGRATION_BACKEND_URL=http://localhost:5000
export INTEGRATION_CLASSIFIER_URL=http://localhost:8000

# Run tests
cd backend
bun test src/__tests__/integration
```

## Test Suites

### 1. Service Connectivity (`services/connectivity.test.ts`)
Tests that all services are running and accessible:
- Backend API health check
- Classifier service availability
- Database connectivity
- Frontend accessibility

### 2. Authentication API (`api/auth.integration.test.ts`)
Tests authentication endpoints:
- User registration
- User login
- Token refresh
- Authentication verification

### 3. Classifier API (`api/classifier.integration.test.ts`)
Tests plant classification endpoints:
- Image upload and classification
- Classification retrieval
- Classification updates

### 4. Species API (`api/species.integration.test.ts`)
Tests species management:
- Species listing
- Species creation
- Species updates
- Search functionality

### 5. End-to-End Workflows (`api/end-to-end.integration.test.ts`)
Tests complete user workflows:
- Registration → Profile Update flow
- Token persistence across requests
- Cross-service communication

### 6. Docker Health Checks (`docker-health.test.ts`)
Tests Docker container health:
- Container status
- Network connectivity
- Port accessibility

## Test Data Cleanup

By default, tests clean up created data. To disable cleanup:

```bash
export INTEGRATION_CLEANUP=false
bun test src/__tests__/integration
```

## Troubleshooting

### Services Not Accessible

If tests fail with connection errors:

1. **Check Docker containers are running**:
   ```bash
   docker ps --filter "name=leaf-"
   ```

2. **Check service URLs**:
   ```bash
   curl http://localhost:5000  # Backend
   curl http://localhost:8000  # Classifier
   ```

3. **Check Docker network**:
   ```bash
   docker network inspect leaf-network
   ```

### Database Connection Issues

If database tests fail:

1. **Verify DATABASE_URL is set correctly**
2. **Check database container is healthy**:
   ```bash
   docker inspect leaf-db --format '{{.State.Health.Status}}'
   ```

3. **Test database connection manually**:
   ```bash
   docker exec -it leaf-db psql -U leafuser -d leafapp -c "SELECT 1;"
   ```

### Timeout Issues

If tests timeout:

1. **Increase timeout**:
   ```bash
   export INTEGRATION_REQUEST_TIMEOUT=30000
   export INTEGRATION_STARTUP_TIMEOUT=60000
   ```

2. **Check service logs**:
   ```bash
   docker logs leaf-backend
   docker logs leaf-classifier
   ```

## CI/CD Integration

These tests can be run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Start Docker services
  run: docker-compose -f docker-compose.prod.yml up -d

- name: Wait for services
  run: sleep 30

- name: Run integration tests
  run: |
    cd backend
    bun test src/__tests__/integration
  env:
    INTEGRATION_BACKEND_URL: http://localhost:5000
    INTEGRATION_CLASSIFIER_URL: http://localhost:8000
```

## Notes

- Integration tests require actual running services
- Tests may create test data in the database
- Some tests require admin credentials (use defaults or set via env vars)
- Tests are designed to be idempotent and clean up after themselves

