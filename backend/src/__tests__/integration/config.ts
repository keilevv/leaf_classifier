/**
 * Integration Test Configuration
 * 
 * Configuration for running integration tests against Docker services
 */

export const INTEGRATION_TEST_CONFIG = {
  // Service URLs - can be overridden via environment variables
  backendUrl: process.env.BACKEND_URL || process.env.INTEGRATION_BACKEND_URL || "http://localhost:5000",
  classifierUrl: process.env.CLASSIFIER_URL || process.env.INTEGRATION_CLASSIFIER_URL || "http://localhost:8000",
  frontendUrl: process.env.FRONTEND_URL || process.env.INTEGRATION_FRONTEND_URL || "http://localhost:5173",
  
  // Database connection (for direct DB tests)
  databaseUrl: process.env.DATABASE_URL || process.env.INTEGRATION_DATABASE_URL,
  
  // Test credentials
  testAdminEmail: process.env.TEST_ADMIN_EMAIL || "adminleaf@yopmail.com",
  testAdminPassword: process.env.TEST_ADMIN_PASSWORD || "admin123",
  testUserEmail: process.env.TEST_USER_EMAIL || "testuser@example.com",
  testUserPassword: process.env.TEST_USER_PASSWORD || "testpassword123",
  
  // Timeouts
  requestTimeout: parseInt(process.env.INTEGRATION_REQUEST_TIMEOUT || "10000"),
  serviceStartupTimeout: parseInt(process.env.INTEGRATION_STARTUP_TIMEOUT || "30000"),
  
  // Test data cleanup
  cleanupAfterTests: process.env.INTEGRATION_CLEANUP !== "false",
};

export function getApiUrl(endpoint: string): string {
  const baseUrl = INTEGRATION_TEST_CONFIG.backendUrl;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}

export function getClassifierUrl(endpoint: string): string {
  const baseUrl = INTEGRATION_TEST_CONFIG.classifierUrl;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}

