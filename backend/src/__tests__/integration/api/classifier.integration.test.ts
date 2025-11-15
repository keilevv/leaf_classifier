/**
 * Plant Classifier API Integration Tests
 * 
 * Tests classification endpoints against running Docker services
 */

import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { TestClient } from "../helpers/testClient";
import { INTEGRATION_TEST_CONFIG } from "../config";

describe("Plant Classifier API Integration", () => {
  let client: TestClient;
  let testUserEmail: string;
  let testUserId: string;

  beforeAll(async () => {
    client = new TestClient();
    testUserEmail = `test-classifier-${Date.now()}@example.com`;

    // Register and login a test user
    await client.register(
      "Classifier Test User",
      testUserEmail,
      "testpassword123",
      "1234567890",
      true
    );

    // Get user ID from auth response
    const meResponse = await client.get("/api/auth/me");
    testUserId = meResponse.data.user?.id;
  });

  afterAll(() => {
    client.clearAuth();
  });

  describe("POST /api/plant-classifier/upload", () => {
    it("should reject request without authentication", async () => {
      client.clearAuth();

      const formData = new FormData();
      const response = await client.post("/api/plant-classifier/upload", formData, {
        headers: formData.getHeaders(),
      });

      expect(response.status).toBe(401);
    });

    it("should reject request without image file", async () => {
      await client.login(testUserEmail, "testpassword123");

      const response = await client.post("/api/plant-classifier/upload", {});

      // Should reject with 400 (bad request) or 415 (unsupported media type)
      expect([400, 415]).toContain(response.status);
    });

    // Note: Full image upload test would require a test image file
    // This is commented out as it requires actual image files
    /*
    it("should successfully classify a plant image", async () => {
      await client.login(testUserEmail, "testpassword123");

      // Create a test image file (you would need to provide a real test image)
      const formData = new FormData();
      const testImagePath = path.join(__dirname, "../../../test-images/test-leaf.jpg");
      
      if (fs.existsSync(testImagePath)) {
        formData.append("image", fs.createReadStream(testImagePath), "test-leaf.jpg");

        const response = await client.post("/api/plant-classifier/upload", formData, {
          headers: formData.getHeaders(),
        });

        expect(response.status).toBe(200);
        expect(response.data.classification).toBeDefined();
        expect(response.data.classification.species).toBeDefined();
      }
    });
    */
  });

  describe("GET /api/plant-classifier/classifications", () => {
    it("should return classifications for authenticated user", async () => {
      await client.login(testUserEmail, "testpassword123");

      const response = await client.get("/api/plant-classifier/classifications", {
        params: {
          page: 1,
          limit: 10,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("results");
      expect(response.data).toHaveProperty("count");
      expect(response.data).toHaveProperty("pages");
      expect(Array.isArray(response.data.results)).toBe(true);
    });

    it("should support pagination", async () => {
      await client.login(testUserEmail, "testpassword123");

      const response = await client.get("/api/plant-classifier/classifications", {
        params: {
          page: 1,
          limit: 5,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data.results.length).toBeLessThanOrEqual(5);
    });

    it("should support filtering", async () => {
      await client.login(testUserEmail, "testpassword123");

      const response = await client.get("/api/plant-classifier/classifications", {
        params: {
          isHealthy: "false",
          isArchived: "false",
        },
      });

      expect(response.status).toBe(200);
      // All results should match the filter
      response.data.results.forEach((classification: any) => {
        expect(classification.isHealthy).toBe(false);
        expect(classification.isArchived).toBe(false);
      });
    });
  });

  describe("PATCH /api/plant-classifier/classification/:id", () => {
    it("should update classification when authenticated", async () => {
      await client.login(testUserEmail, "testpassword123");

      // First, get a classification (if any exist)
      const listResponse = await client.get("/api/plant-classifier/classifications", {
        params: { limit: 1 },
      });

      if (listResponse.data.results.length > 0) {
        const classificationId = listResponse.data.results[0].id;

        const updateResponse = await client.patch(
          `/api/plant-classifier/classification/${classificationId}`,
          {
            taggedSpecies: "test-species",
            taggedShape: "elliptic",
            taggedHealthy: true,
          }
        );

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.data.results).toBeDefined();
      } else {
        console.log("No classifications found, skipping update test");
      }
    });
  });
});

