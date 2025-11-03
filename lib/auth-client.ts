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

// --- Cookie helpers for propagating tenant to server-side proxy ---
function setTenantCookie(tenantId: string | number, maxAgeSeconds = 60 * 60 * 24 * 30) {
  if (typeof document === "undefined") return;
  const v = encodeURIComponent(String(tenantId));
  document.cookie = `robotice-tenant-id=${v}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

function clearTenantCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `robotice-tenant-id=; Path=/; Max-Age=0; SameSite=Lax`;
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
  // Best-effort: if tenant has an id, also mirror into cookie for server-side proxy
  try {
    const id = (tenant && (tenant.id || tenant.tenant_id)) as string | number | undefined;
    if (id != null) setTenantCookie(id);
  } catch {}
}

export function removeTenant(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TENANT_KEY);
  try { clearTenantCookie(); } catch {}
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

// Change password for logged-in user (settings)
export async function changePassword(currentPassword: string, newPassword: string): Promise<any> {
  // Try a set of common endpoints/methods and body shapes to match backend implementation
  const candidates: Array<{ method: "POST" | "PUT" | "PATCH"; path: string }> = [
    { method: "POST", path: "/api/v1/auth/change-password" },
    { method: "POST", path: "/api/v1/auth/password" },
    { method: "PUT",  path: "/api/v1/auth/password" },
    { method: "PATCH", path: "/api/v1/auth/password" },
    { method: "POST", path: "/api/v1/users/password" },
    { method: "POST", path: "/api/v1/profile/password" },
  ];
  const bodies: Array<Record<string, string>> = [
    { current_password: currentPassword, new_password: newPassword },
    { old_password: currentPassword,     new_password: newPassword },
    { password: currentPassword,         new_password: newPassword },
  ];

  const headers = buildHeaders(true);
  let lastStatus = 0;
  let lastError = "";
  for (const c of candidates) {
    for (const b of bodies) {
      const url = getRequestUrl(c.path, true);
      try {
        const res = await fetch(url, {
          method: c.method,
          headers: { ...headers, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(b),
        });
        lastStatus = res.status;
        if (res.ok) {
          if (process.env.NODE_ENV !== "production") {
            console.debug("changePassword via", c.method, c.path, "with body keys", Object.keys(b));
          }
          return res.json().catch(() => ({ ok: true }));
        }
        // For 404/405 try next candidate; for 400/401/403/422 surface error
        const text = await res.text();
        let msg = "Change password failed";
        try {
          const j = JSON.parse(text);
          msg = j?.detail || j?.message || msg;
        } catch {}
        lastError = `[${res.status}] ${msg}`;
        if (res.status === 404 || res.status === 405) {
          continue; // try next candidate
        } else {
          throw new Error(lastError);
        }
      } catch (err: any) {
        // network or thrown above; continue if not final attempt
        lastError = err?.message || String(err);
      }
    }
  }
  throw new Error(lastError || `[${lastStatus || 0}] Change password failed`);
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  // Clear any stale data before login
  removeToken();
  removeRefreshToken();
  removeTenant();
  
  // Llamada simple al endpoint server-side que usa la API_KEY del entorno (Vercel injecta)
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
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
  // Persist onboarding flags if present
  const onboardingStatus = tenantData?.onboarding_status;
  const onboardingStep = tenantData?.onboarding_step;
  const googleTokenLive = tenantData?.google_token_live;
  
  if (!userData) {
    throw new Error("Login response missing user data");
  }
  
  if (!tenantData || !tenantId) {
    throw new Error("Login response missing tenant data");
  }
  
  // Store user and tenant data from login response
  setUser(userData);
  setTenant({ ...tenantData, onboarding_status: onboardingStatus, onboarding_step: onboardingStep, google_token_live: googleTokenLive });
  
  // Store tenant ID in localStorage for API calls
  localStorage.setItem("robotice-tenant-id", tenantId.toString());
  // And also as a cookie so server proxy can inject X-Tenant-ID when needed
  try { setTenantCookie(tenantId); } catch {}
  
  // Return a minimal token object for compatibility
  return { access_token: "", token_type: "api-key" } as AuthTokens;
}

export type RegisterRequest = {
  email: string;
  password: string;
  business_name?: string;
  first_name?: string;
  last_name?: string;
};

export async function register(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
  businessName?: string
): Promise<any> {
  // Force proxy for register to ensure server API key is used
  const url = getRequestUrl("/api/v1/auth/register", true);
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify({
      email,
      password,
      business_name: businessName,
      first_name: firstName,
      last_name: lastName,
    } as RegisterRequest),
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

export async function verifyEmail(verificationCode: string, email?: string): Promise<any> {
  // Force proxy for verify-email to ensure server API key is used
  const url = getRequestUrl("/api/v1/auth/verify-email", true);
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify({ verification_code: verificationCode, email }),
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
  try { removeToken(); } catch {}
  try { removeRefreshToken(); } catch {}
  try { removeTenant(); } catch {}
  try { localStorage.removeItem("robotice-tenant-id"); } catch {}
  try { clearTenantCookie(); } catch {}
  // Defensive: clear user storage key explicitly in case removeToken changes
  try { localStorage.removeItem("robotice_user"); } catch {}
  // Clear any signup helpers used during verification
  try { sessionStorage.removeItem("signup_email"); } catch {}
  // Optional: clear any onboarding temp cache keys
  try { localStorage.removeItem("robotice-oauth-state"); } catch {}
  window.location.href = "/login";
}

export function isAuthenticated(): boolean {
  // Consider authenticated if hay datos de usuario en localStorage
  try { return !!getUser(); } catch { return false; }
}
