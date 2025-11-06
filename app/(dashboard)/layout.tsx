"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser, getUserTenant, getTenant, setTenant as setTenantStore, logout } from "@/lib/auth-client";
import { apiGet } from "@/lib/api";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { User } from "@/types/types";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Give a brief moment for localStorage to be available
    const checkAuth = async () => {
        if (!isAuthenticated()) {
          window.location.href = "/login";
          return;
        }
        
        const userData = getUser();
        if (!userData) {
          window.location.href = "/login";
          return;
        }
      
        // Get tenant data, then refresh from backend to avoid stale flags
        let currentTenant: any = null;
        try {
          currentTenant = await getUserTenant();
        } catch (e) {
          currentTenant = getTenant();
        }

        // Attempt refresh from backend tenant-info (injects API key via proxy)
        try {
          const res = await apiGet("/auth/tenant-info");
          if (res.ok) {
            const info = await res.json();
            // Merge known flags into tenant structure we keep
            currentTenant = {
              ...(currentTenant || {}),
              billing_paid: info?.billing_paid ?? currentTenant?.billing_paid,
              onboarded: info?.onboarded ?? currentTenant?.onboarded,
              google_token_live: info?.google_token_live ?? currentTenant?.google_token_live,
              onboarding_status: info?.onboarding_status ?? currentTenant?.onboarding_status,
              onboarding_step: info?.onboarding_step ?? currentTenant?.onboarding_step,
            };
            try { setTenantStore(currentTenant); } catch {}
          }
        } catch (e) {
          console.warn("[DashboardLayout] tenant-info refresh failed", e);
        }

        setUser(userData);
        setTenant(currentTenant);

        // Enforce paywall using backend flags only:
        // unpaid -> /checkout; paid and not onboarded -> /onboarding/audience; onboarded -> dashboard
        try {
          if (!currentTenant?.billing_paid) {
            window.location.replace("/checkout");
            return;
          }
          if (!currentTenant?.onboarded) {
            window.location.replace("/onboarding/audience");
            return;
          }
        } catch {}
      setLoading(false);
    };
    
    // Small delay to ensure localStorage is populated after login redirect
    const timer = setTimeout(() => { void checkAuth(); }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-white dark:bg-black flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
      <div className={`min-h-screen bg-white dark:bg-black`}>
        {/* Sidebar */}
        <DashboardSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          user={user}
          tenant={tenant}
        />

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Fixed top navbar (landing non-scroll style) */}
          <DashboardNavbar
            onMenuClick={() => setSidebarOpen(true)}
            user={user}
            tenant={tenant}
            onLogout={handleLogout}
          />

          {/* Page Content */}
          <main className="px-4 py-4 pt-28 lg:pt-32">
            {children}
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
  );
}
