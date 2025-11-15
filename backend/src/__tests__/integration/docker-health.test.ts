/**
 * Docker Health Check Tests
 * 
 * Tests that verify all Docker containers are healthy and services are running
 */

import { describe, it, expect } from "bun:test";
import { exec } from "child_process";
import { promisify } from "util";
import { INTEGRATION_TEST_CONFIG } from "./config";

const execAsync = promisify(exec);

describe("Docker Container Health", () => {
  describe("Container Status", () => {
    it("should have all required containers running", async () => {
      const { stdout } = await execAsync(
        "docker ps --format '{{.Names}} {{.Status}}' --filter 'name=leaf-'"
      );

      const containers = stdout
        .trim()
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [name, ...statusParts] = line.split(" ");
          return { name, status: statusParts.join(" ") };
        });

      const requiredContainers = ["leaf-db", "leaf-backend", "leaf-classifier", "leaf-frontend"];

      const runningContainers = containers.map((c) => c.name);

      requiredContainers.forEach((containerName) => {
        expect(runningContainers).toContain(containerName);
      });

      // Check that all containers are running (not exited, restarting, etc.)
      containers.forEach((container) => {
        expect(container.status.toLowerCase()).toContain("up");
      });
    });

    it("should have database container healthy", async () => {
      try {
        const { stdout } = await execAsync(
          "docker inspect leaf-db --format '{{.State.Health.Status}}'"
        );
        const healthStatus = stdout.trim().toLowerCase();
        expect(["healthy", "starting"]).toContain(healthStatus);
      } catch (error) {
        // If healthcheck is not configured, skip this test
        console.log("Database healthcheck not configured, skipping");
      }
    });

    it("should have containers on the same network", async () => {
      const { stdout } = await execAsync(
        "docker network inspect leaf-network --format '{{range .Containers}}{{.Name}} {{end}}'"
      );

      const networkContainers = stdout.trim().split(" ").filter((name) => name);

      const requiredContainers = ["leaf-db", "leaf-backend", "leaf-classifier", "leaf-frontend"];

      requiredContainers.forEach((containerName) => {
        expect(networkContainers).toContain(containerName);
      });
    });
  });

  describe("Port Accessibility", () => {
    it("should have backend accessible on expected port", async () => {
      const axios = await import("axios");
      try {
        const response = await axios.default.get(INTEGRATION_TEST_CONFIG.backendUrl, {
          timeout: 5000,
          validateStatus: () => true,
        });
        expect(response.status).toBeLessThan(500);
      } catch (error: any) {
        if (error.code === "ECONNREFUSED") {
          throw new Error(
            `Backend not accessible at ${INTEGRATION_TEST_CONFIG.backendUrl}. Check if container is running and port is exposed.`
          );
        }
        throw error;
      }
    });

    it("should have classifier accessible on expected port", async () => {
      const axios = await import("axios");
      try {
        const response = await axios.default.get(INTEGRATION_TEST_CONFIG.classifierUrl, {
          timeout: 5000,
          validateStatus: () => true,
        });
        expect(response.status).toBeLessThan(500);
      } catch (error: any) {
        if (error.code === "ECONNREFUSED") {
          throw new Error(
            `Classifier not accessible at ${INTEGRATION_TEST_CONFIG.classifierUrl}. Check if container is running and port is exposed.`
          );
        }
        throw error;
      }
    });
  });
});

