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

// Server-only: API key debe permanecer privada
function getServerApiKey(): string {
  const key = typeof process !== "undefined" ? process.env.API_KEY : undefined;
  return key ? String(key) : "";
}

// En cliente siempre usamos el proxy de Next para no exponer la API key
function shouldProxyToNext(): boolean {
  return typeof window !== "undefined";
}

export async function apiGet(path: string, init?: RequestInit): Promise<Response> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const useProxy = shouldProxyToNext();
  const fullPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`;
  const url = useProxy ? `/api/bridge${fullPath}` : `${base}${fullPath}`;
  
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> || {}),
    Accept: "application/json",
  };

  // Sólo en servidor adjuntamos la API key
  if (!useProxy) {
    const k = getServerApiKey();
    if (k) headers["X-API-Key"] = k;
  }
  
  return fetch(url, { 
    ...init, 
    method: "GET", 
    headers
  });
}

export async function apiPost(path: string, body: unknown, init?: RequestInit): Promise<Response> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const useProxy = shouldProxyToNext();
  const fullPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`;
  const url = useProxy ? `/api/bridge${fullPath}` : `${base}${fullPath}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json", 
    Accept: "application/json", 
    ...(init?.headers as Record<string, string> || {})
  };

  // Sólo en servidor adjuntamos la API key
  if (!useProxy) {
    const k = getServerApiKey();
    if (k) headers["X-API-Key"] = k;
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


