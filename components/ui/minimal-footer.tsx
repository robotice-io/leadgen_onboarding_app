"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function MinimalFooter() {
  const year = new Date().getFullYear();

  const links = [
    { title: "Login", href: "/login" },
    { title: "Planes", href: "/pricing#comparison" },
    { title: "Onboarding", href: "/onboarding" },
  ];

  return (
    <footer className="relative bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
        className="relative mx-auto max-w-5xl px-6 py-10 md:py-14"
      >
        {/* subtle approaching glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40%_75%_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

        <div className="flex flex-col items-center gap-5">
          <Link href="/" className="flex items-center gap-2 opacity-90 hover:opacity-100 transition">
            <Image
              src="/landing_logo.png"
              alt="Robotice.io"
              width={120}
              height={40}
              className="brightness-200"
            />
          </Link>

          <nav className="flex items-center gap-5 text-sm text-white/80">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-1 py-0.5 hover:text-white transition-colors"
              >
                {l.title}
              </Link>
            ))}
          </nav>

          <p className="mt-2 text-xs text-white/60">
            © {year} Robotice.io — LeadGen. Todos los derechos reservados.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
