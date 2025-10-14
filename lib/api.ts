export function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return String(process.env.NEXT_PUBLIC_API_BASE_URL);
  }
  if (typeof window !== "undefined") {
    const v = (window as any).ENV_API_BASE_URL as string | undefined;
    if (v) return v;
  }
  // Default to provided server IP
  return "http://192.241.157.92:8000";
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

export async function apiGet(path: string, init?: RequestInit): Promise<Response> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const fullPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`;
  const url = `${base}${fullPath}`;
  
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> || {}),
    Accept: "application/json",
  };

  const apiKey = getApiKey();
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }
  
  return fetch(url, { 
    ...init, 
    method: "GET", 
    headers
  });
}

export async function apiPost(path: string, body: unknown, init?: RequestInit): Promise<Response> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const fullPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`;
  const url = `${base}${fullPath}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json", 
    Accept: "application/json", 
    ...(init?.headers as Record<string, string> || {})
  };

  const apiKey = getApiKey();
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
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


