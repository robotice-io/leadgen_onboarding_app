"use client";

import { useEffect, useState } from "react";
import { getTenant } from "@/lib/auth-client";

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function useTenantId() {
  const [tenantId, setTenantId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const resolve = () => {
      try {
        const t = getTenant();
        const fromObj = t?.tenant_id ? Number(t.tenant_id) : null;
        const fromLs = typeof window !== 'undefined' ? Number(localStorage.getItem('robotice-tenant-id') || '') || null : null;
        const fromCookie = getCookie('robotice-tenant-id');
        const fromC = fromCookie ? Number(fromCookie) : null;
        const id = fromObj || fromLs || fromC;
        if (mounted) setTenantId(id);
      } catch {
        if (mounted) setTenantId(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    // Small timeout to allow login redirect/localStorage writes to settle
    const timer = setTimeout(resolve, 60);
    return () => { mounted = false; clearTimeout(timer); };
  }, []);

  return { tenantId, loading } as const;
}
