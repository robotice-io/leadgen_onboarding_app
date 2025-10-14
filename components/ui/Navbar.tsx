"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth-client";

export function Navbar() {
  const pathname = usePathname();
  const isPricing = pathname?.startsWith("/pricing");
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    try { setAuthed(isAuthenticated()); } catch { setAuthed(false); }
  }, []);
  return (
    <div className="fixed top-0 inset-x-0 z-40">
      <div className="mx-4 my-3 rounded-2xl border border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-xl">
        <nav className="flex items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/landing_logo.png" alt="Robotice" width={120} height={32} className="h-6 w-auto" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/pricing#comparison" className={`hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isPricing ? "bg-white/15" : "hover:bg-white/10"}`}>
              Pricing
            </Link>
            {authed ? (
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/20">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)]">
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
