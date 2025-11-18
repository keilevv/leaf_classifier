/**
 * Species API Integration Tests
 * 
 * Tests species management endpoints against running Docker services
 */

import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { TestClient } from "../helpers/testClient";
import { INTEGRATION_TEST_CONFIG } from "../config";

describe("Species API Integration", () => {
  let client: TestClient;
  let testUserEmail: string;
  let createdSpeciesId: string | null = null;

  beforeAll(async () => {
    client = new TestClient();
    testUserEmail = `test-species-${Date.now()}@example.com`;

    // Register and login a test user
    await client.register(
      "Species Test User",
      testUserEmail,
      "testpassword123",
      "1234567890",
      true
    );
  });

  afterAll(async () => {
    // Cleanup: Delete created species if it exists
    if (createdSpeciesId) {
      try {
        await client.delete(`/api/species/${createdSpeciesId}`);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    client.clearAuth();
  });

  describe("GET /api/species", () => {
    it("should return list of species", async () => {
      const response = await client.get("/api/species", {
        params: {
          page: 1,
          limit: 10,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("results");
      expect(response.data).toHaveProperty("count");
      expect(Array.isArray(response.data.results)).toBe(true);
    });

    it("should support search filtering", async () => {
      const response = await client.get("/api/species", {
        params: {
          search: "zea",
        },
      });

      expect(response.status).toBe(200);
      // Results should contain "zea" in name fields
      response.data.results.forEach((species: any) => {
        const searchLower = "zea".toLowerCase();
        const matches =
          species.scientificName?.toLowerCase().includes(searchLower) ||
          species.commonNameEn?.toLowerCase().includes(searchLower) ||
          species.commonNameEs?.toLowerCase().includes(searchLower);
        expect(matches).toBe(true);
      });
    });
  });

  describe("POST /api/species", () => {
    it("should create a new species when authenticated", async () => {
      await client.login(testUserEmail, "testpassword123");

      const uniqueName = `Test Species ${Date.now()}`;
      const response = await client.post("/api/species", {
        scientificName: uniqueName,
        commonNameEn: "Test Plant",
        commonNameEs: "Planta de Prueba",
      });

      expect(response.status).toBe(201);
      expect(response.data.species).toBeDefined();
      expect(response.data.species.scientificName).toBe(uniqueName);
      createdSpeciesId = response.data.species.id;
    });

    it("should reject creation without authentication", async () => {
      client.clearAuth();

      const response = await client.post("/api/species", {
        scientificName: "Unauthorized Species",
        commonNameEn: "Test",
        commonNameEs: "Prueba",
      });

      expect(response.status).toBe(401);
    });

    it("should reject creation with missing required fields", async () => {
      await client.login(testUserEmail, "testpassword123");

      const response = await client.post("/api/species", {
        scientificName: "Incomplete Species",
        // Missing commonNameEn and commonNameEs
      });

      expect(response.status).toBe(400);
    });
  });

  describe("PATCH /api/species/:id", () => {
    it("should update species (admin only)", async () => {
      // Login as admin
      await client.login(
        INTEGRATION_TEST_CONFIG.testAdminEmail,
        INTEGRATION_TEST_CONFIG.testAdminPassword
      );

      if (createdSpeciesId) {
        const response = await client.patch(`/api/species/${createdSpeciesId}`, {
          scientificName: "Updated Scientific Name",
          commonNameEn: "Updated English Name",
          commonNameEs: "Nombre Actualizado",
        });

        expect(response.status).toBe(200);
        expect(response.data.species.scientificName).toBe("Updated Scientific Name");
      } else {
        console.log("No species created, skipping update test");
      }
    });
  });
});

