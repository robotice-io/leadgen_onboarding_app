"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Mail, 
  Settings, 
  Users, 
  TrendingUp,
  X,
  Building2
} from "lucide-react";
import { User } from "@/types/types";
import { useI18n } from "@/lib/i18n";
import { OnboardingButton } from "./OnboardingButton";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  tenant: any;
}

export function DashboardSidebar({ isOpen, onClose, user, tenant }: SidebarProps) {
  const { t } = useI18n();
  const pathname = usePathname();

  // Get tenant info with fallbacks
  const getTenantName = () => {
    // Try tenant data first
    if (tenant?.name) return tenant.name;
    if (tenant?.org_name) return tenant.org_name;
    if (tenant?.company_name) return tenant.company_name;
    
    // Try localStorage data as fallback
    try {
      const orgName = localStorage.getItem("robotice-org-name");
      if (orgName) return orgName;
    } catch {}
    
    // Try user data
    if (user?.company) return user.company;
    
    return "My Company";
  };

  const getTenantEmail = () => {
    // Try tenant data first
    if (tenant?.email) return tenant.email;
    if (tenant?.contact_email) return tenant.contact_email;
    
    // Try localStorage data as fallback
    try {
      const contactEmail = localStorage.getItem("robotice-contact-email");
      if (contactEmail) return contactEmail;
    } catch {}
    
    // Fallback to user email
    return user?.email || "";
  };

  const navigation = [
    { name: t("nav.dashboard"), href: "/dashboard", icon: BarChart3 },
    { name: t("nav.campaigns"), href: "/dashboard/campaigns", icon: Mail },
    { name: t("nav.analytics"), href: "/dashboard/analytics", icon: TrendingUp },
    { name: t("nav.contacts"), href: "/dashboard/contacts", icon: Users },
    { name: t("nav.settings"), href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
  <div className="hidden lg:fixed lg:top-28 lg:bottom-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-3 overflow-y-auto px-4 py-4 mx-0 mr-3 my-3 rounded-2xl border bg-white text-gray-900 border-black/10 dark:bg-black dark:text-white dark:border-white/30">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center justify-center py-2">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/landing_logo.png"
                alt="Robotice"
                width={120}
                height={40}
                className="rounded-lg hover:opacity-80 transition-opacity object-contain"
              />
            </Link>
          </div>

          {/* Tenant Info Card (no dropdown) */}
          <div className="relative">
            <div className="w-full flex items-center p-3 rounded-lg bg-black/5 dark:bg-white/5">
              <Building2 className="h-5 w-5 text-gray-600 dark:text-white/70" />
              <div className="text-left ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getTenantName()}
                </p>
                <p className="text-xs text-gray-600 dark:text-white/70">
                  {getTenantEmail()}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = item.href === '/dashboard'
                      ? pathname === item.href
                      : (pathname === item.href || pathname.startsWith(item.href + '/'));
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={`
                            group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-all border
                            ${isActive
                              ? 'bg-black/5 text-gray-900 border-black/10 dark:bg-white/10 dark:text-white dark:border-white/15'
                              : 'text-gray-700 hover:text-black hover:bg-black/5 border-transparent dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5'
                            }
                          `}
                        >
                          <item.icon
                            className={`h-5 w-5 shrink-0 ${
                              isActive ? 'text-gray-700 dark:text-white' : 'text-gray-600 group-hover:text-black dark:text-white/60 dark:group-hover:text-white'
                            }`}
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>

          {/* Bottom Section (no divider, with breathing space) */}
          <div className="mt-4 pt-1 pb-2">
            <OnboardingButton user={user} />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 z-50 flex w-64 flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex grow flex-col gap-y-3 overflow-y-auto bg-white text-gray-900 dark:bg-black dark:text-white px-4 py-4">
          {/* Mobile Header */}
          <div className="flex h-24 shrink-0 items-center justify-between">
            <Link href="/" className="flex items-center justify-center">
              <Image src="/landing_logo.png" alt="Robotice" width={140} height={90} className="rounded-lg hover:opacity-80 transition-opacity object-contain" />
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Navigation - Same as desktop */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = item.href === '/dashboard'
                      ? pathname === item.href
                      : (pathname === item.href || pathname.startsWith(item.href + '/'));
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`
                            group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-all
                            ${isActive ? 'bg-black/5 text-gray-900 dark:bg-white/10 dark:text-white' : 'text-gray-700 hover:text-black hover:bg-black/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5'}
                          `}
                        >
                          <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-gray-700 dark:text-white' : 'text-gray-600 group-hover:text-black dark:text-white/60 dark:group-hover:text-white'}`} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
          
          {/* Mobile Bottom Section (no divider, with breathing space) */}
          <div className="mt-4 pt-1 pb-2">
            <OnboardingButton user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
