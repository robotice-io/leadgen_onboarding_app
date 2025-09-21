export function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return String(process.env.NEXT_PUBLIC_API_BASE_URL);
  }
  if (typeof window !== "undefined") {
    const v = (window as any).ENV_API_BASE_URL as string | undefined;
    if (v) return v;
  }
  return "http://localhost:8000";
}

export async function apiGet(path: string, init?: RequestInit): Promise<Response> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const url = `${base}${path}`;
  return fetch(url, { ...init, method: "GET", headers: { ...(init?.headers || {}), Accept: "application/json" } });
}

export async function apiPost(path: string, body: unknown, init?: RequestInit): Promise<Response> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const url = `${base}${path}`;
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


