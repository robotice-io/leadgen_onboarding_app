export function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return String(process.env.NEXT_PUBLIC_API_BASE_URL);
  }
  if (typeof window !== "undefined") {
    const v = (window as any).ENV_API_BASE_URL as string | undefined;
    if (v) return v;
  }
  // Default to provided server IP if no env is configured
  return "http://192.241.157.92:8000";
}

export function getApiKey(): string {
  if (typeof process !== "undefined" && process.env.API_KEY) {
    return String(process.env.API_KEY);
  }
  // Default API key (should be moved to environment variable)
  return "lk_ad23ea53ecf1a7937b66d9a18fe30848056fc88a97eea7f7a2a7b1d9a1cc1175";
}

function shouldProxyToNext(apiBase: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const isFrontendHttps = window.location.protocol === "https:";
    const apiIsHttp = apiBase.startsWith("http://");
    return isFrontendHttps && apiIsHttp;
  } catch {
    return false;
  }
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("robotice_auth_token");
}

export async function apiGet(path: string, init?: RequestInit): Promise<Response> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const useProxy = shouldProxyToNext(base);
  const url = useProxy ? `/api/bridge${path}` : `${base}${path}`;
  const apiKey = getApiKey();
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> || {}),
    Accept: "application/json",
    "X-API-Key": apiKey,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return fetch(url, { 
    ...init, 
    method: "GET", 
    headers
  });
}

export async function apiPost(path: string, body: unknown, init?: RequestInit): Promise<Response> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const useProxy = shouldProxyToNext(base);
  const url = useProxy ? `/api/bridge${path}` : `${base}${path}`;
  const apiKey = getApiKey();
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json", 
    Accept: "application/json", 
    "X-API-Key": apiKey,
    ...(init?.headers as Record<string, string> || {})
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...init,
    method: "POST",
    headers,
    body: JSON.stringify(body ?? {}),
  });
}

export function getAppBaseUrl(): string {
  const env = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_APP_BASE_URL : undefined;
  if (env) return String(env);
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "";
}


