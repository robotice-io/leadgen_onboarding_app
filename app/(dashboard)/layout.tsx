"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { isAuthenticated, getUser, getUserTenant, getTenant, logout } from "@/lib/auth-client";
import { I18nProvider } from "@/lib/i18n";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { User } from "@/types/types";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

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
        console.log("[DashboardLayout] Not authenticated, redirecting to login");
        window.location.href = "/login";
        return;
      }
      
      const userData = getUser();
      if (!userData) {
        console.log("[DashboardLayout] No user data found, redirecting to login");
        window.location.href = "/login";
        return;
      }
      
      // Get tenant data from API
      try {
        const tenantData = await getUserTenant();
        console.log("[DashboardLayout] Tenant data received:", tenantData);
        console.log("[DashboardLayout] Auth successful, loading dashboard for user:", userData, "tenant:", tenantData);
        setUser(userData);
        setTenant(tenantData);
      } catch (error) {
        console.warn("[DashboardLayout] Failed to fetch tenant data:", error);
        // Try to get tenant from localStorage as fallback
        try {
          const localTenant = getTenant();
          setUser(userData);
          setTenant(localTenant);
        } catch (localError) {
          console.warn("[DashboardLayout] No tenant data available:", localError);
          setUser(userData);
          setTenant(null);
        }
      }
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
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center ${poppins.className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <I18nProvider>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${poppins.className}`}>
        {/* Sidebar */}
        <DashboardSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          user={user}
          tenant={tenant}
        />

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Header */}
          <DashboardHeader 
            onMenuClick={() => setSidebarOpen(true)}
            user={user}
            tenant={tenant}
            onLogout={handleLogout}
          />

          {/* Page Content */}
          <main className="p-4 lg:p-8">
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
    </I18nProvider>
  );
}
