"use client";

import { getApiBaseUrl } from "./api";

export interface AuthTokens {
  access_token: string;
  token_type: string;
  user?: {
    id: number;
    email: string;
    tenant_id?: number;
  };
}

const TOKEN_KEY = "robotice_auth_token";
const USER_KEY = "robotice_user";

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

  const data = await res.json();
  setToken(data.access_token);
  if (data.user) setUser(data.user);
  
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
  const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Email verification failed");
  }
}

export async function forgotPassword(email: string): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to send reset email");
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });

  if (!res.ok) {
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
  window.location.href = "/login";
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
