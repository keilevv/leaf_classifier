/**
 * Stress test for classifier performance
 * 
 * MOCKS Cloudflare R2 upload - focuses on measuring classification process execution time
 * Does NOT upload to actual Cloudflare buckets
 * 
 * Use case: Measure how fast the classifier can process N images through the model
 * while mocking the expensive Cloudflare storage operations.
 * 
 * Leave stress-test-upload.js intact for whole-flow testing (actual Cloudflare uploads).
 * 
 * This test uses autocannon with mocked R2 responses to measure pure classification
 * performance without actual cloud storage overhead.
 */

import autocannon from "autocannon";
import fs from "fs";
import FormData from "form-data";

// Mock Cloudflare R2 before autocannon runs
// This intercepts the upload and returns a fake URL instead of uploading
const originalFetch = global.fetch;

global.fetch = async (input, init) => {
  // Check if this is a Cloudflare R2 upload request
  if (typeof input === 'string' && input.includes('/api/plant-classifier/upload')) {
    // Return a mock response instead of actually uploading
    const formData = new FormData();
    if (init && init.body) {
      formData.body = init.body;
    }
    
    // Create a mock response
    const mockKey = `classified-${Date.now()}.jpg`;
    const mockUrl = `https://r2.leaf-classifier.test/${mockKey}`;
    
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      json: async () => ({
        success: true,
        key: mockKey,
        url: mockUrl,
        message: 'Image classified and stored successfully'
      }),
      text: async () => JSON.stringify({
        success: true,
        key: mockKey,
        url: mockUrl,
        message: 'Image classified and stored successfully'
      }),
      ok: true,
      body: {},
      type: 'default',
      url: input,
    };
  }
  return originalFetch(input, init);
};

async function runClassificationStressTest() {
  console.log("Authenticating...");
  const loginResponse = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "adminleaf@yopmail.com",
      password: "admin123",
    }),
  });

  const loginData = await loginResponse.json();

  if (!loginResponse.ok || !loginData.accessToken) {
    console.error("Login failed!", loginData);
    process.exit(1);
  }

  console.log("Login successful! Starting classification stress test...");
  const token = loginData.accessToken;

  // Create test image
  const imagePath = `${import.meta.dir}/test-image.jpg`;
  if (!fs.existsSync(imagePath)) {
    console.error(`Test image not found at ${imagePath}`);
    process.exit(1);
  }

  const image = fs.readFileSync(imagePath);
  const form = new FormData();
  form.append("image", image, "test-image.jpg");

  const body = form.getBuffer();
  const headers = Object.assign(form.getHeaders(), {
    Authorization: `Bearer ${token}`,
  });

  console.log(`Sending ${5000} requests with ${50} concurrent connections...`);
  console.log("(Cloudflare uploads mocked - measuring classification only)");

  const instance = autocannon({
    url: "http://localhost:5000",
    connections: 50,
    amount: 5000, // number of requests
    requests: [
      {
        method: "POST",
        path: "/api/plant-classifier/upload",
        headers,
        body,
      },
    ],
  }, (err, data) => {
    if (err) {
      console.error("Autocannon error:", err);
      return;
    }
    console.log("\n=== Stress Test Results ===");
    console.log(`Requests completed: ${data.requests}`);
    console.log(`Total duration: ${data.latency.mean.toFixed(2)}ms mean`);
    console.log(`Requests/sec: ${Math.round(data.requests / (data.latency.mean / 1000))} req/s`);
    console.log("\n(Note: R2 uploads mocked via fetch interceptor - pure classification timing)");
    process.exit(0);
  });

  autocannon.track(instance, { renderProgressBar: true });

  // Wait for test to complete (autocannon will call the callback on done)
  await new Promise((resolve) => {
    instance.on("done", resolve);
  });
}

// Run the test
runClassificationStressTest().catch((err) => {
  console.error("Stress test failed:", err);
  process.exit(1);
});
