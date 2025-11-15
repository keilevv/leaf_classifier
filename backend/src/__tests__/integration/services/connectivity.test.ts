/**
 * Service Connectivity Integration Tests
 * 
 * Tests that all services are running and accessible in Docker
 */

import { describe, it, expect, beforeAll } from "bun:test";
import axios from "axios";
import { INTEGRATION_TEST_CONFIG, getApiUrl, getClassifierUrl } from "../config";

describe("Service Connectivity", () => {
  describe("Backend API", () => {
    it("should be accessible and responding", async () => {
      const response = await axios.get(INTEGRATION_TEST_CONFIG.backendUrl, {
        timeout: INTEGRATION_TEST_CONFIG.requestTimeout,
        validateStatus: () => true,
      });

      expect(response.status).toBeLessThan(500); // Any status < 500 means service is up
    });

    it("should respond to health check endpoint", async () => {
      const response = await axios.get(getApiUrl("/"), {
        timeout: INTEGRATION_TEST_CONFIG.requestTimeout,
        validateStatus: () => true,
      });

      expect(response.status).toBe(200);
      expect(response.data).toContain("Hello World");
    });
  });

  describe("Classifier Service", () => {
    it("should be accessible", async () => {
      const response = await axios.get(INTEGRATION_TEST_CONFIG.classifierUrl, {
        timeout: INTEGRATION_TEST_CONFIG.requestTimeout,
        validateStatus: () => true,
      });

      expect(response.status).toBeLessThan(500);
    });

    it("should have predict endpoint available", async () => {
      // Just check if the endpoint exists (will fail with 405 or 400, not 404)
      const response = await axios.post(
        getClassifierUrl("/predict"),
        {},
        {
          timeout: INTEGRATION_TEST_CONFIG.requestTimeout,
          validateStatus: () => true,
        }
      );

      // 404 means endpoint doesn't exist, anything else means it exists
      expect(response.status).not.toBe(404);
    });
  });

  describe("Database", () => {
    it("should be accessible via Prisma", async () => {
      // This test requires DATABASE_URL to be set
      if (!INTEGRATION_TEST_CONFIG.databaseUrl) {
        console.warn("DATABASE_URL not set, skipping database connectivity test");
        return;
      }

      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: INTEGRATION_TEST_CONFIG.databaseUrl,
          },
        },
      });

      try {
        // Try to query the database
        await prisma.$connect();
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        expect(result).toBeDefined();
      } finally {
        await prisma.$disconnect();
      }
    });
  });

  describe("Frontend", () => {
    it("should be accessible", async () => {
      const response = await axios.get(INTEGRATION_TEST_CONFIG.frontendUrl, {
        timeout: INTEGRATION_TEST_CONFIG.requestTimeout,
        validateStatus: () => true,
      });

      expect(response.status).toBeLessThan(500);
    });
  });
});

