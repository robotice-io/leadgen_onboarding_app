"use client";

import { getApiBaseUrl } from "./api";

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

// Get the correct URL (direct to backend)
function getRequestUrl(path: string, preferProxy = false): string {
  const apiBase = getApiBaseUrl();
  const fullPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`;
  const k = getApiKey();
  // If preferProxy or no public API key, route through server proxy which injects X-API-Key
  if (preferProxy || !k) return `/api/bridge${fullPath}`;
  return `${apiBase}${fullPath}`;
}

function getTenantIdFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("robotice-tenant-id");
}

// Get API key from public env (temporary for debugging)
function getApiKey(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_KEY) {
    return String(process.env.NEXT_PUBLIC_API_KEY);
  }
  if (typeof window !== "undefined" && (window as any).ENV_API_KEY) {
    return String((window as any).ENV_API_KEY);
  }
  return "";
}

// Helper to build headers with API key and tenant
function buildHeaders(includeApiKey = true): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  
  const tenantId = getTenantIdFromStorage();
  if (tenantId) {
    headers["X-Tenant-ID"] = String(tenantId);
  }
  
  if (includeApiKey) {
    const apiKey = getApiKey();
    if (apiKey) headers["X-API-Key"] = apiKey;
  }
  
  return headers;
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
  
  // Force proxy for login to ensure server API key is used
  const url = getRequestUrl("/api/v1/auth/login", true);
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(true), // Include API key via proxy
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const errorText = await res.text();
    let errorMessage = "Login failed";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson?.detail || errorJson?.message || errorMessage;
    } catch {
      // keep generic message to avoid leaking details
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
  // Force proxy for register to ensure server API key is used
  const url = getRequestUrl("/api/v1/auth/register", true);
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(true),
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
    let errorMessage = "Registration failed";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson?.detail || errorJson?.message || errorMessage;
    } catch {}
    throw new Error(`[${res.status}] ${errorMessage}`);
  }

  // Return the registration response for UI feedback
  const response = await res.json();
  return response;
}

export async function verifyEmail(verificationCode: string): Promise<any> {
  // Force proxy for verify-email to ensure server API key is used
  const url = getRequestUrl("/api/v1/auth/verify-email", true);
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify({ verification_code: verificationCode }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const errorText = await res.text();
    let errorMessage = "Email verification failed";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson?.detail || errorJson?.message || errorMessage;
    } catch {}
    throw new Error(`[${res.status}] ${errorMessage}`);
  }

  // Return the verification response for UI feedback
  const response = await res.json();
  return response;
}

export async function forgotPassword(email: string): Promise<any> {
  // Force proxy for forgot-password to ensure server API key is used
  const url = getRequestUrl("/api/v1/auth/forgot-password", true);
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const errorText = await res.text();
    let errorMessage = "Failed to send reset email";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson?.detail || errorJson?.message || errorMessage;
    } catch {}
    throw new Error(`[${res.status}] ${errorMessage}`);
  }

  // Return the forgot password response for UI feedback
  const response = await res.json();
  return response;
}

export async function resetPassword(token: string, newPassword: string): Promise<any> {
  // Force proxy for reset-password to ensure server API key is used
  const url = getRequestUrl("/api/v1/auth/reset-password", true);
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify({ token, new_password: newPassword }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const errorText = await res.text();
    let errorMessage = "Password reset failed";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson?.detail || errorJson?.message || errorMessage;
    } catch {}
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
  // Consider authenticated if hay datos de usuario en localStorage
  try { return !!getUser(); } catch { return false; }
}
