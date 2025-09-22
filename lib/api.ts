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

export async function apiGet(path: string, init?: RequestInit): Promise<Response> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const useProxy = shouldProxyToNext(base);
  const url = useProxy ? `/api/bridge${path}` : `${base}${path}`;
  return fetch(url, { ...init, method: "GET", headers: { ...(init?.headers || {}), Accept: "application/json" } });
}

export async function apiPost(path: string, body: unknown, init?: RequestInit): Promise<Response> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const useProxy = shouldProxyToNext(base);
  const url = useProxy ? `/api/bridge${path}` : `${base}${path}`;
  return fetch(url, {
    ...init,
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...(init?.headers || {}) },
    body: JSON.stringify(body ?? {}),
  });
}

export function getAppBaseUrl(): string {
  const env = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_APP_BASE_URL : undefined;
  if (env) return String(env);
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "";
}


