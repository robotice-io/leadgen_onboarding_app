"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { getUser } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme";
import Switch from "@/components/ui/Switch";
import { Menu } from "lucide-react";

type Props = {
  onMenuClick?: () => void;
  onLogout: () => void;
  tenant?: any;
  user?: any;
};

export default function DashboardNavbar({ onMenuClick, onLogout, tenant, user }: Props) {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!(e.target instanceof Node)) return;
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const currentUser = user || getUser() || {};

  const getTenantName = () => tenant?.name || tenant?.org_name || tenant?.company_name || currentUser?.company || "";
  const getTenantEmail = () => tenant?.email || tenant?.contact_email || currentUser?.email || "";
  const ThemeSwitch = () => <Switch checked={theme === "dark"} onChange={() => toggle()} ariaLabel="Toggle theme" />;

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <div className="mx-4 my-3 rounded-2xl border bg-white text-gray-900 border-black/10 dark:border-white/30 dark:bg-black dark:text-white">
        <nav className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            {/* Mobile menu button (only on small screens) */}
            {onMenuClick && (
              <button
                className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 border border-white/10 mr-1"
                aria-label="Abrir menú"
                onClick={onMenuClick}
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Link href="/" className="flex items-center gap-2">
              <Image src="/landing_logo.png" alt="Robotice" width={160} height={40} className="h-8 sm:h-9 w-auto" />
            </Link>
          </div>

          {/* Right actions: search, notifications, user menu */}
          <div className="flex items-center gap-3" ref={ref}>
            {/* Search */}
            <div className="hidden md:flex items-center h-9 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 px-2 min-w-[200px]">
              <svg width="16" height="16" viewBox="0 0 256 256" className="text-gray-600 dark:text-white/60">
                <path fill="currentColor" d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
              <input
                placeholder="Search"
                className="ml-2 bg-transparent outline-none text-sm text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/60 w-48"
              />
            </div>
            {/* Bell */}
            <button
              className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-gray-700 dark:text-white"
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
              </svg>
            </button>
            <button
              aria-label="User menu"
              onClick={() => setOpen((v) => !v)}
              className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-500 shadow hover:opacity-90 focus:outline-none"
            />
            {open && (
              <div className="absolute right-6 top-[68px] w-80 rounded-2xl border bg-white text-gray-900 border-black/10 p-4 text-sm z-50 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.5)] dark:border-white/10 dark:bg-black dark:text-white">
                <div className="mb-3">
                  <div className="font-semibold leading-tight">{getTenantName()}</div>
                  <div className="text-gray-600 dark:text-white/70 break-all text-xs">{getTenantEmail()}</div>
                </div>
                <div className="grid gap-3">
                  {/* Language segmented control */}
                  <div>
                    <div className="text-xs text-gray-600 dark:text-white/70 mb-1">Idioma</div>
                    <div className="inline-flex items-center rounded-full border border-black/10 bg-black/5 p-0.5 dark:border-white/15 dark:bg-white/5">
                      <button
                        type="button"
                        onClick={() => setLang("es")}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${lang === "es" ? "bg-black text-white dark:bg-white dark:text-black" : "text-gray-800 dark:text-white/80"}`}
                      >ES</button>
                      <button
                        type="button"
                        onClick={() => setLang("en")}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${lang === "en" ? "bg-black text-white dark:bg-white dark:text-black" : "text-gray-800 dark:text-white/80"}`}
                      >EN</button>
                    </div>
                  </div>

                  {/* Theme toggle */}
                  <div>
                    <div className="text-xs text-gray-600 dark:text-white/70 mb-1">Tema</div>
                    <div className="flex items-center justify-between rounded-xl border border-black/10 bg-black/5 px-3 py-2 dark:border-white/15 dark:bg-white/5">
                      <span className="text-xs text-gray-800 dark:text-white/80">{theme === "dark" ? "Oscuro" : "Claro"}</span>
                      {/* iOS-like Switch */}
                      <ThemeSwitch />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-2">
                    <button
                      onClick={onLogout}
                      className="w-full h-9 rounded-xl bg-black/5 hover:bg-black/10 border border-black/10 text-left px-3 dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/15"
                    >
                      {t("dashboard.signOut")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
