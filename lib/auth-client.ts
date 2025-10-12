"use client";

import { getApiBaseUrl, getApiKey } from "./api";

export interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  user?: {
    id: number;
    email: string;
    tenant_id?: number;
  };
}

const TOKEN_KEY = "robotice_auth_token";
const USER_KEY = "robotice_user";
const REFRESH_TOKEN_KEY = "robotice_refresh_token";
const TENANT_KEY = "robotice_tenant";

// Check if we need to proxy requests through Next.js API routes
function shouldUseProxy(apiBase: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const isFrontendHttps = window.location.protocol === "https:";
    const apiIsHttp = apiBase.startsWith("http://");
    return isFrontendHttps && apiIsHttp;
  } catch {
    return false;
  }
}

// Get the correct URL (either direct or through proxy)
function getRequestUrl(path: string): string {
  const apiBase = getApiBaseUrl();
  const useProxy = shouldUseProxy(apiBase);
  
  if (useProxy) {
    // Use Next.js API proxy to avoid mixed content errors
    return `/api/bridge${path}`;
  } else {
    // Direct connection to API
    return `${apiBase}${path}`;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setUser(user: any): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function removeRefreshToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getTenant(): any | null {
  if (typeof window === "undefined") return null;
  const t = localStorage.getItem(TENANT_KEY);
  if (!t) return null;
  try { return JSON.parse(t); } catch { return null; }
}


export function setTenant(tenant: any): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TENANT_KEY, JSON.stringify(tenant));
}

export function removeTenant(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TENANT_KEY);
}

let refreshTimerId: number | undefined;

// API key-based auth does not require refresh; keep stubs for compatibility
async function refreshAccessTokenInternal(): Promise<AuthTokens> {
  return Promise.resolve({ access_token: "", token_type: "api-key" });
}

export async function refreshAccessToken(): Promise<AuthTokens> {
  const tokens = await refreshAccessTokenInternal();
  return tokens;
}

export function scheduleTokenRefresh(expiresInSeconds?: number): void {
  // No-op under API key auth
  if (typeof window === "undefined") return;
  if (refreshTimerId) {
    window.clearTimeout(refreshTimerId);
    refreshTimerId = undefined;
  }
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  // Clear any stale data before login
  removeToken();
  removeRefreshToken();
  removeTenant();
  
  const url = getRequestUrl("/api/v1/auth/login");
  const res = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-API-Key": getApiKey(),
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const errorText = await res.text();
    let errorMessage = errorText || "Login failed";
    
    // Try to parse JSON error response
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorJson.message || errorText;
    } catch {
      // If not JSON, use the text as is
    }
    
    throw new Error(`[${res.status}] ${errorMessage}`);
  }

  // Parse the login response
  const loginData = await res.json();
  
  // Extract user and tenant data from login response
  const userData = loginData.user;
  const tenantData = loginData.tenant;
  const tenantId = tenantData?.id;
  
  if (!userData) {
    throw new Error("Login response missing user data");
  }
  
  if (!tenantData || !tenantId) {
    throw new Error("Login response missing tenant data");
  }
  
  // Store user and tenant data from login response
  setUser(userData);
  setTenant(tenantData);
  
  // Store tenant ID in localStorage for API calls
  localStorage.setItem("robotice-tenant-id", tenantId.toString());
  
  // Return a minimal token object for compatibility
  return { access_token: "", token_type: "api-key" } as AuthTokens;
}

export async function register(
  email: string, 
  password: string, 
  firstName?: string,
  lastName?: string
): Promise<any> {
  const url = getRequestUrl("/api/v1/auth/register");
  const res = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-API-Key": getApiKey(),
    },
    body: JSON.stringify({ 
      email, 
      password,
      first_name: firstName,
      last_name: lastName
    }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const errorText = await res.text();
    let errorMessage = errorText || "Registration failed";
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorJson.message || errorText;
    } catch {
      // If not JSON, use the text as is
    }
    
    throw new Error(`[${res.status}] ${errorMessage}`);
  }

  // Return the registration response for UI feedback
  const response = await res.json();
  return response;
}

export async function verifyEmail(verificationCode: string): Promise<any> {
  const url = getRequestUrl("/api/v1/auth/verify-email");
  const res = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-API-Key": getApiKey(),
    },
    body: JSON.stringify({ verification_code: verificationCode }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const errorText = await res.text();
    let errorMessage = errorText || "Email verification failed";
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorJson.message || errorText;
    } catch {
      // If not JSON, use the text as is
    }
    
    throw new Error(`[${res.status}] ${errorMessage}`);
  }

  // Return the verification response for UI feedback
  const response = await res.json();
  return response;
}

export async function forgotPassword(email: string): Promise<any> {
  const url = getRequestUrl("/api/v1/auth/forgot-password");
  const res = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-API-Key": getApiKey(),
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const errorText = await res.text();
    let errorMessage = errorText || "Failed to send reset email";
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorJson.message || errorText;
    } catch {
      // If not JSON, use the text as is
    }
    
    throw new Error(`[${res.status}] ${errorMessage}`);
  }

  // Return the forgot password response for UI feedback
  const response = await res.json();
  return response;
}

export async function resetPassword(token: string, newPassword: string): Promise<any> {
  const url = getRequestUrl("/api/v1/auth/reset-password");
  const res = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-API-Key": getApiKey(),
    },
    body: JSON.stringify({ token, new_password: newPassword }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const errorText = await res.text();
    let errorMessage = errorText || "Password reset failed";
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorJson.message || errorText;
    } catch {
      // If not JSON, use the text as is
    }
    
    throw new Error(`[${res.status}] ${errorMessage}`);
  }

  // Return the reset password response for UI feedback
  const response = await res.json();
  return response;
}

export async function getCurrentUser(): Promise<any> {
  // Get user data from localStorage (stored during login)
  const userData = getUser();
  
  if (!userData) {
    throw new Error("No user data found. Please log in again.");
  }
  
  return userData;
}

export async function getUserTenant(): Promise<any> {
  // Get tenant data from localStorage (stored during login)
  const tenantData = getTenant();
  
  if (!tenantData) {
    throw new Error("No tenant data found. Please log in again.");
  }
  
  return tenantData;
}

export async function logout(): Promise<void> {
  removeTenant();
  window.location.href = "/login";
}

export function isAuthenticated(): boolean {
  // In API key mode, consider authenticated if API key is present
  try { return !!getApiKey(); } catch { return false; }
}
