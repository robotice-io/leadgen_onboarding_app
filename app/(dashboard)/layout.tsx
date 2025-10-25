"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, getUser, getUserTenant, getTenant, logout } from "@/lib/auth-client";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { User } from "@/types/types";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { BarChart3, Mail, TrendingUp, Users, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { OnboardingButton } from "@/components/dashboard/OnboardingButton";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
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
      
        // Get tenant data from API
        try {
          const tenantData = await getUserTenant();
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
        {/* Fixed top navbar */}
        <DashboardNavbar
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          tenant={tenant}
          onLogout={handleLogout}
        />

        {/* Content row (sidebar + main) */}
        <div className="flex pt-24 md:pt-28">
          {/* Modern Sidebar */}
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
            <SidebarBody className="justify-between gap-6">
              <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/* Logo / Tenant */}
                <Link href="/" className="flex items-center justify-start gap-2">
                  <Image src="/landing_logo.png" alt="Robotice" width={140} height={36} className="h-8 w-auto rounded-lg" />
                </Link>

                {/* Navigation */}
                <div className="mt-6 flex flex-col gap-1.5">
                  {[
                    { label: t("nav.dashboard"), href: "/dashboard", icon: <BarChart3 className="h-5 w-5" /> },
                    { label: t("nav.campaigns"), href: "/dashboard/campaigns", icon: <Mail className="h-5 w-5" /> },
                    { label: t("nav.analytics"), href: "/dashboard/analytics", icon: <TrendingUp className="h-5 w-5" /> },
                    { label: t("nav.contacts"), href: "/dashboard/contacts", icon: <Users className="h-5 w-5" /> },
                    { label: t("nav.settings"), href: "/dashboard/settings", icon: <Settings className="h-5 w-5" /> },
                  ].map((item) => {
                    const active = item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <SidebarLink
                        key={item.href}
                        link={item}
                        className={active ? "bg-black/5 dark:bg-white/10 rounded-md px-2" : "rounded-md px-2"}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Bottom block: Onboarding status */}
              <div className="mt-4 pt-1 pb-2">
                <OnboardingButton user={user} />
              </div>
            </SidebarBody>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 px-4 py-4">
            {/* Extra top padding to clear navbar on small screens */}
            <div className="pt-4 md:pt-6">
              {children}
            </div>
          </main>
        </div>
      </div>
  );
}
