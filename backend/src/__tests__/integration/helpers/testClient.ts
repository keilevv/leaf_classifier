/**
 * Test HTTP Client for Integration Tests
 * 
 * Provides helper methods for making authenticated and unauthenticated requests
 */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { INTEGRATION_TEST_CONFIG, getApiUrl } from "../config";

export class TestClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || INTEGRATION_TEST_CONFIG.backendUrl,
      timeout: INTEGRATION_TEST_CONFIG.requestTimeout,
      validateStatus: () => true, // Don't throw on any status code
    });
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string) {
    this.accessToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAuth() {
    this.accessToken = null;
  }

  /**
   * Make a GET request
   */
  async get(endpoint: string, config?: AxiosRequestConfig) {
    return this.client.get(endpoint, this.addAuth(config));
  }

  /**
   * Make a POST request
   */
  async post(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.post(endpoint, data, this.addAuth(config));
  }

  /**
   * Make a PATCH request
   */
  async patch(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.patch(endpoint, data, this.addAuth(config));
  }

  /**
   * Make a PUT request
   */
  async put(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.put(endpoint, data, this.addAuth(config));
  }

  /**
   * Make a DELETE request
   */
  async delete(endpoint: string, config?: AxiosRequestConfig) {
    return this.client.delete(endpoint, this.addAuth(config));
  }

  /**
   * Add authentication header if token is set
   */
  private addAuth(config?: AxiosRequestConfig): AxiosRequestConfig {
    const headers = {
      ...config?.headers,
      ...(this.accessToken && {
        Authorization: `Bearer ${this.accessToken}`,
      }),
    };
    return { ...config, headers };
  }

  /**
   * Login and store the access token
   */
  async login(email: string, password: string) {
    const response = await this.post("/api/auth/login", { email, password });
    if (response.status === 200 && response.data.accessToken) {
      this.setAuthToken(response.data.accessToken);
      return response.data;
    }
    throw new Error(`Login failed: ${response.status} - ${JSON.stringify(response.data)}`);
  }

  /**
   * Register a new user and optionally login
   */
  async register(
    fullName: string,
    email: string,
    password: string,
    phone: string,
    autoLogin = false
  ) {
    const response = await this.post("/api/auth/register", {
      fullName,
      email,
      password,
      phone,
    });
    if (autoLogin && response.status === 200 && response.data.accessToken) {
      this.setAuthToken(response.data.accessToken);
    }
    return response;
  }
}

