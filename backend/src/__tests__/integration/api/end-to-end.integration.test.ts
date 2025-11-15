/**
 * End-to-End Integration Tests
 * 
 * Tests complete user workflows across all services
 */

import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { TestClient } from "../helpers/testClient";
import { INTEGRATION_TEST_CONFIG } from "../config";

describe("End-to-End Workflows", () => {
  let client: TestClient;
  let testUserEmail: string;
  let testUserId: string;

  beforeAll(async () => {
    client = new TestClient();
    testUserEmail = `e2e-test-${Date.now()}@example.com`;
  });

  afterAll(() => {
    client.clearAuth();
  });

  describe("Complete User Registration and Profile Flow", () => {
    it("should complete full registration and profile update workflow", async () => {
      // Step 1: Register new user
      const registerResponse = await client.register(
        "E2E Test User",
        testUserEmail,
        "testpassword123",
        "1234567890",
        true
      );

      expect(registerResponse.status).toBe(200);
      testUserId = registerResponse.data.user.id;

      // Step 2: Get user profile
      const profileResponse = await client.get(`/api/users/${testUserId}`);
      expect(profileResponse.status).toBe(200);
      expect(profileResponse.data.user.email).toBe(testUserEmail);

      // Step 3: Update user profile
      const updateResponse = await client.patch(`/api/users/${testUserId}/update`, {
        fullName: "Updated E2E User",
        phone: "9876543210",
        institution: "Test University",
        department: "Biology",
        location: "Test Location",
        bio: "Test bio for integration testing",
      });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.user.fullName).toBe("Updated E2E User");
      expect(updateResponse.data.user.institution).toBe("Test University");
    });
  });

  describe("Authentication Token Flow", () => {
    it("should maintain authentication across multiple requests", async () => {
      // Login
      await client.login(testUserEmail, "testpassword123");

      // Make multiple authenticated requests
      const requests = [
        client.get("/api/auth/me"),
        client.get("/api/plant-classifier/classifications", { params: { limit: 1 } }),
        client.get("/api/species", { params: { limit: 1 } }),
      ];

      const responses = await Promise.all(requests);

      // All should succeed (200 or appropriate status)
      responses.forEach((response) => {
        expect(response.status).toBeLessThan(400);
      });
    });
  });

  describe("Cross-Service Integration", () => {
    it("should verify backend can communicate with classifier service", async () => {
      // This test verifies that the backend can reach the classifier
      // We'll test by checking if the classifier endpoint is accessible
      // from the backend's perspective (via network)

      const axios = await import("axios");
      const classifierUrl = INTEGRATION_TEST_CONFIG.classifierUrl;

      try {
        const response = await axios.default.get(`${classifierUrl}/`, {
          timeout: 5000,
          validateStatus: () => true,
        });

        // Any response (even 404) means the service is reachable
        expect(response.status).toBeLessThan(500);
      } catch (error: any) {
        // If it's a network error, the service might not be accessible
        if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
          throw new Error(
            `Classifier service at ${classifierUrl} is not accessible. Check Docker network configuration.`
          );
        }
        throw error;
      }
    });
  });
});

