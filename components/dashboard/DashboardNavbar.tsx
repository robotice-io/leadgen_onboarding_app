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
    <div className="fixed top-0 inset-x-0 z-40">
      <div className="mx-4 my-3 rounded-2xl border border-white/30 bg-black text-white">
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

          <div className="flex items-center gap-3" ref={ref}>
            <button
              aria-label="User menu"
              onClick={() => setOpen((v) => !v)}
              className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-500 shadow hover:opacity-90 focus:outline-none"
            />
            {open && (
              <div className="absolute right-6 top-[68px] w-80 rounded-2xl border border-white/10 bg-black p-4 text-sm z-50 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.5)]">
                <div className="mb-3">
                  <div className="font-semibold leading-tight">{getTenantName()}</div>
                  <div className="text-white/70 break-all text-xs">{getTenantEmail()}</div>
                </div>
                <div className="grid gap-3">
                  {/* Language segmented control */}
                  <div>
                    <div className="text-xs text-white/70 mb-1">Idioma</div>
                    <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 p-0.5">
                      <button
                        type="button"
                        onClick={() => setLang("es")}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${lang === "es" ? "bg-white text-black" : "text-white/80"}`}
                      >ES</button>
                      <button
                        type="button"
                        onClick={() => setLang("en")}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${lang === "en" ? "bg-white text-black" : "text-white/80"}`}
                      >EN</button>
                    </div>
                  </div>

                  {/* Theme toggle */}
                  <div>
                    <div className="text-xs text-white/70 mb-1">Tema</div>
                    <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2">
                      <span className="text-xs text-white/80">{theme === "dark" ? "Oscuro" : "Claro"}</span>
                      {/* iOS-like Switch */}
                      <ThemeSwitch />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-2">
                    <button
                      onClick={onLogout}
                      className="w-full h-9 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-left px-3"
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
