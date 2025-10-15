export function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return String(process.env.NEXT_PUBLIC_API_BASE_URL);
  }
  if (typeof window !== "undefined") {
    const v = (window as any).ENV_API_BASE_URL as string | undefined;
    if (v) return v;
  }
  // Default to HTTPS backend URL
  return "https://lead-gen-service.robotice.io";
}

function getTenantIdFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("robotice-tenant-id");
  } catch {
    return null;
  }
}

export async function apiGet(path: string, init?: RequestInit): Promise<Response> {
  const fullPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`;
  const url = `/api/bridge${fullPath}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init?.headers as Record<string, string> || {}),
  };
  const tenantId = getTenantIdFromStorage();
  if (tenantId && !headers["X-Tenant-ID"]) headers["X-Tenant-ID"] = String(tenantId);

  return fetch(url, {
    ...init,
    method: "GET",
    headers,
  });
}

export async function apiPost(path: string, body: unknown, init?: RequestInit): Promise<Response> {
  const fullPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`;
  const url = `/api/bridge${fullPath}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(init?.headers as Record<string, string> || {}),
  };
  const tenantId = getTenantIdFromStorage();
  if (tenantId && !headers["X-Tenant-ID"]) headers["X-Tenant-ID"] = String(tenantId);

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


