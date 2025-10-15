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
  const latestY = useRef(0);
  const ticking = useRef(false);
  const hideTimer = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    try { setAuthed(isAuthenticated()); } catch { setAuthed(false); }
  }, []);

  useEffect(() => {
    function update() {
      const y = latestY.current;
      setScrolled(y > 8);
  const delta = y - lastY.current;
  const threshold = 6;
  const hideDelay = 220; // ms delay to avoid flicker
      if (y > 24 && delta > threshold) {
        if (hideTimer.current) window.clearTimeout(hideTimer.current);
        hideTimer.current = window.setTimeout(() => setHidden(true), hideDelay) as unknown as number;
      } else if (delta < -threshold) {
        if (hideTimer.current) {
          window.clearTimeout(hideTimer.current);
          hideTimer.current = null;
        }
        setHidden(false);
      }
      lastY.current = y;
      ticking.current = false;
    }
    function onScroll() {
      latestY.current = window.scrollY || 0;
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(update);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll as any);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      const h = rootRef.current?.offsetHeight || 0;
      setNavHeight(h);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
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

  const containerBase = "fixed top-0 inset-x-0 z-40";

  const isGlass = scrolled || mobileOpen;
  const shellClasses = [
    "mx-4 my-3 rounded-2xl border transition-all",
    isGlass
      ? hidden
        ? "backdrop-blur-xl bg-white/12 border-white/15 shadow-[0_14px_32px_-12px_rgba(0,0,0,0.6)] duration-400"
        : "backdrop-blur-xl bg-white/12 border-white/15 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.5)] duration-300"
      : "bg-transparent border-white/30 backdrop-blur-0 shadow-none duration-300",
  ].join(" ");

  const linkBase = "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10";
  const activePill = "bg-white/15 text-white";
  const isHome = pathname === "/";
  const isPricing = pathname?.startsWith("/pricing");
  const homeActive = isHome && (activeHash === "" || activeHash === "#top");
  const howActive = isHome && activeHash === "#como-funciona";
  const pricingActive = isPricing;

  return (
    <motion.div
      ref={rootRef}
      className={containerBase}
      style={{ willChange: "transform, opacity" }}
      animate={{ y: hidden ? -(navHeight + 12) : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: hidden ? 0.55 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={shellClasses}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/landing_logo.png" alt="Robotice" width={160} height={40} className="h-8 sm:h-9 w-auto" />
            </Link>
            {/* Mobile hamburger on the left for better balance */}
            <button
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 border border-white/10"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/" className={[linkBase, homeActive ? activePill : ""].join(" ")}>{lang === "es" ? "Home" : "Home"}</Link>
              <Link href="/#como-funciona" className={[linkBase, howActive ? activePill : ""].join(" ")}>{lang === "es" ? "Cómo funciona" : "How it works"}</Link>
              <Link href="/pricing#comparison" className={[linkBase, pricingActive ? activePill : ""].join(" ")}>{lang === "es" ? "Planes" : "Pricing"}</Link>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="mailto:contact@robotice.io" className="hidden md:inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10">
              {lang === "es" ? "Contacto" : "Contact"}
            </Link>
            {authed ? (
              <div ref={profileRef} className="relative">
                <Link href="/dashboard" className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/20 mr-1">
                  {t("nav.dashboard")}
                </Link>
                <button
                  aria-label="User menu"
                  onClick={() => setOpen((v) => !v)}
                  className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-500 shadow hover:opacity-90 focus:outline-none"
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
              <Link href="/login" className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)]">
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
    </motion.div>
  );
}
