"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { getUser, isAuthenticated, logout } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";

export function Navbar() {
  const { t, lang } = useI18n();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const lastY = useRef(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");

  useEffect(() => {
    try { setAuthed(isAuthenticated()); } catch { setAuthed(false); }
  }, []);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY || 0;
      setScrolled(y > 8);
      const delta = y - lastY.current;
      const threshold = 6;
      if (y > 24 && delta > threshold) {
        setHidden(true);
      } else if (delta < -threshold) {
        setHidden(false);
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll as any);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!(e.target instanceof Node)) return;
      if (profileRef.current && !profileRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    // Track hash for active state on anchors
    const updateHash = () => setActiveHash(window.location.hash || "");
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const containerClasses = [
    "fixed top-0 inset-x-0 z-40 transition-transform duration-300",
    hidden ? "-translate-y-full" : "translate-y-0",
  ].join(" ");

  const shellClasses = [
    "mx-4 my-3 rounded-2xl border backdrop-blur-xl",
    scrolled ? "bg-white/12 border-white/15" : "bg-white/7 border-white/10",
  ].join(" ");

  const linkBase = "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10";
  const activePill = "bg-white/15 text-white";
  const isHome = pathname === "/";
  const isPricing = pathname?.startsWith("/pricing");
  const homeActive = isHome && (activeHash === "" || activeHash === "#top");
  const howActive = isHome && activeHash === "#como-funciona";
  const pricingActive = isPricing;

  return (
    <div className={containerClasses}>
      <div className={shellClasses}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/landing_logo.png" alt="Robotice" width={160} height={40} className="h-8 sm:h-9 w-auto" />
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/" className={[linkBase, homeActive ? activePill : ""].join(" ")}>{lang === "es" ? "Home" : "Home"}</Link>
              <Link href="/#como-funciona" className={[linkBase, howActive ? activePill : ""].join(" ")}>{lang === "es" ? "Cómo funciona" : "How it works"}</Link>
              <Link href="/pricing#comparison" className={[linkBase, pricingActive ? activePill : ""].join(" ")}>{lang === "es" ? "Planes" : "Pricing"}</Link>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 border border-white/10"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="mailto:contact@robotice.io" className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10">
              {lang === "es" ? "Contacto" : "Contact"}
            </Link>
            {authed ? (
              <div ref={profileRef} className="relative">
                <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/20 mr-1">
                  {t("nav.dashboard")}
                </Link>
                <button
                  aria-label="User menu"
                  onClick={() => setOpen((v) => !v)}
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-500 shadow hover:opacity-90 focus:outline-none"
                />
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -6 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 top-[44px] w-72 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-4 text-sm z-50 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.5)]"
                    >
                      <div className="mb-3">
                        <div className="font-semibold">
                          {(() => {
                            const u = getUser();
                            const name = u?.first_name || u?.name || u?.email?.split("@")[0] || "user";
                            return name;
                          })()}
                        </div>
                        <div className="text-white/70 break-all">{getUser()?.email || "user@example.com"}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link href="/dashboard" className="rounded-lg px-3 py-2 hover:bg-white/10">{t("nav.dashboard")}</Link>
                        <button onClick={() => logout()} className="rounded-lg px-3 py-2 text-left hover:bg-white/10">Logout</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)]">
                {lang === "es" ? "Login" : "Login"}
              </Link>
            )}
          </div>
        </nav>
        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mx-3 mb-3 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-3"
            >
              <div className="flex flex-col gap-1">
                <Link href="/" onClick={() => setMobileOpen(false)} className={[linkBase, homeActive ? activePill : ""].join(" ")}>Home</Link>
                <Link href="/#como-funciona" onClick={() => setMobileOpen(false)} className={[linkBase, howActive ? activePill : ""].join(" ")}>{lang === "es" ? "Cómo funciona" : "How it works"}</Link>
                <Link href="/pricing#comparison" onClick={() => setMobileOpen(false)} className={[linkBase, pricingActive ? activePill : ""].join(" ")}>{lang === "es" ? "Planes" : "Pricing"}</Link>
                <Link href="mailto:contact@robotice.io" onClick={() => setMobileOpen(false)} className={linkBase}>{lang === "es" ? "Contacto" : "Contact"}</Link>
                {authed ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/20 mt-1">{t("nav.dashboard")}</Link>
                    <button onClick={() => { setMobileOpen(false); logout(); }} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10">Logout</button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white mt-1">Login</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
