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

async function refreshAccessTokenInternal(): Promise<AuthTokens> {
  const rt = getRefreshToken();
  if (!rt) throw new Error("No refresh token");

  const url = getRequestUrl("/api/v1/auth/refresh");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${rt}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const text = await res.text();
    let msg = text || "Token refresh failed";
    try {
      const j = JSON.parse(text);
      msg = j.detail || j.message || msg;
    } catch {}
    throw new Error(`[${res.status}] ${msg}`);
  }

  const data: AuthTokens = await res.json();
  if (data.access_token) setToken(data.access_token);
  if (data.refresh_token) setRefreshToken(data.refresh_token);
  if (typeof data.expires_in === "number") scheduleTokenRefresh(data.expires_in);
  return data;
}

export async function refreshAccessToken(): Promise<AuthTokens> {
  const tokens = await refreshAccessTokenInternal();
  return tokens;
}

export function scheduleTokenRefresh(expiresInSeconds?: number): void {
  if (typeof window === "undefined") return;
  if (refreshTimerId) {
    window.clearTimeout(refreshTimerId);
    refreshTimerId = undefined;
  }
  const fallback = 1800; // 30 minutes default
  const seconds = typeof expiresInSeconds === "number" && expiresInSeconds > 0 ? expiresInSeconds : fallback;
  // Refresh 3 minutes before expiry, minimum 60s
  const delayMs = Math.max(60, seconds - 180) * 1000;
  refreshTimerId = window.setTimeout(async () => {
    try {
      await refreshAccessTokenInternal();
    } catch {
      // If refresh fails, ensure user is logged out to avoid loops
      await logout();
    }
  }, delayMs);
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const url = getRequestUrl("/api/v1/auth/login");
  const res = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      // No API key required for auth endpoints
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

  const data: AuthTokens = await res.json();
  setToken(data.access_token);
  if (data.refresh_token) setRefreshToken(data.refresh_token);
  
  // Fetch user data immediately after login
  try {
    const userData = await getCurrentUser();
    setUser(userData);
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
  
  // Try to fetch and persist tenant data (optional)
  try {
    const tenant = await getUserTenant();
    if (tenant) setTenant(tenant);
  } catch (e) {
    // No tenant is acceptable for new users
  }

  // Schedule silent refresh
  scheduleTokenRefresh(data.expires_in);
  
  return data;
}

export async function register(
  email: string, 
  password: string, 
  firstName?: string,
  lastName?: string
): Promise<void> {
  const url = getRequestUrl("/api/v1/auth/register");
  const res = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      // No API key required for auth endpoints
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
}

export async function verifyEmail(token: string): Promise<void> {
  const url = getRequestUrl("/api/v1/auth/verify-email");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const error = await res.text();
    throw new Error(error || "Email verification failed");
  }
}

export async function forgotPassword(email: string): Promise<void> {
  const url = getRequestUrl("/api/v1/auth/forgot-password");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const error = await res.text();
    throw new Error(error || "Failed to send reset email");
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const url = getRequestUrl("/api/v1/auth/reset-password");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const error = await res.text();
    throw new Error(error || "Password reset failed");
  }
}

export async function getCurrentUser(): Promise<any> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const url = getRequestUrl("/api/v1/auth/me");
  const res = await fetch(url, {
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      // No API key required for auth endpoints
    },
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const errorText = await res.text();
    let errorMessage = errorText || "Failed to get user info";
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorJson.message || errorText;
    } catch {
      // If not JSON, use the text as is
    }
    
    throw new Error(`[${res.status}] ${errorMessage}`);
  }

  return res.json();
}

export async function getUserTenant(): Promise<any> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const url = getRequestUrl("/api/v1/auth/me/tenant");
  const res = await fetch(url, {
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      // No API key required for auth endpoints
    },
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("[429] Too many attempts. Try again in a minute.");
    }
    const errorText = await res.text();
    let errorMessage = errorText || "Failed to get tenant info";
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorJson.message || errorText;
    } catch {
      // If not JSON, use the text as is
    }
    
    throw new Error(`[${res.status}] ${errorMessage}`);
  }

  return res.json();
}

export async function logout(): Promise<void> {
  removeToken();
  removeRefreshToken();
  removeTenant();
  window.location.href = "/login";
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
