"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, LogOut, User as UserIcon, Wrench } from "lucide-react";
import { User } from "@/types/types";
import { useI18n } from "@/lib/i18n";

interface HeaderProps {
  onMenuClick: () => void;
  user: User | null;
  tenant: any;
  onLogout: () => void;
}

function LangToggle({ lang, onChange }: { lang: "es" | "en"; onChange: (l: "es" | "en") => void }) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden">
      <button
        className={"px-2 h-7 text-xs font-medium transition-colors " + (lang === "es" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700")}
        onClick={() => onChange("es")}
      >
        ES
      </button>
      <button
        className={"px-2 h-7 text-xs font-medium transition-colors " + (lang === "en" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700")}
        onClick={() => onChange("en")}
      >
        EN
      </button>
    </div>
  );
}

export function DashboardHeader({ onMenuClick, user, tenant, onLogout }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { lang, setLang, t } = useI18n();

  // Debug logging
  console.log("[DashboardHeader] Received tenant data:", tenant);
  console.log("[DashboardHeader] Tenant name options:", {
    name: tenant?.name,
    org_name: tenant?.org_name,
    company_name: tenant?.company_name,
    user_company: user?.company
  });
  console.log("[DashboardHeader] Tenant email options:", {
    email: tenant?.email,
    contact_email: tenant?.contact_email,
    user_email: user?.email
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <LangToggle lang={lang} onChange={setLang} />
          
          {/* Connect Account Button */}
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Wrench className="h-4 w-4" />
            <span className="hidden sm:inline">{t("dashboard.connectAccount")}</span>
            <span className="sm:hidden">Connect</span>
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.first_name?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {tenant?.name || tenant?.org_name || tenant?.company_name || user?.company || "My Company"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tenant?.email || tenant?.contact_email || user?.email}
                </p>
              </div>
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {tenant?.name || tenant?.org_name || tenant?.company_name || user?.company || "My Company"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {tenant?.email || tenant?.contact_email || user?.email}
                  </p>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
