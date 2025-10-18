"use client";

import { useI18n } from "@/lib/i18n";

export default function TopBar() {
  const { lang, setLang, t } = useI18n();
  return (
    <header className="w-full border-b border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoImage />
          <div className="leading-tight">
            <div className="font-semibold">{t("brandName")}</div>
            <div className="text-xs text-black/60 dark:text-white/60">{t("tagline")}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle lang={lang} onChange={setLang} />
        </div>
      </div>
    </header>
  );
}

function LogoImage() {
  return (
    <img src="/icon.png" alt="Robotice" className="w-8 h-8 rounded" />
  );
}

function LangToggle({ lang, onChange }: { lang: "es" | "en"; onChange: (l: "es" | "en") => void }) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-black/10 dark:border-white/15 overflow-hidden">
      <button
        className={"px-3 h-8 text-sm " + (lang === "es" ? "bg-blue-600 text-white" : "")}
        onClick={() => onChange("es")}
      >
        ES
      </button>
      <button
        className={"px-3 h-8 text-sm " + (lang === "en" ? "bg-blue-600 text-white" : "")}
        onClick={() => onChange("en")}
      >
        EN
      </button>
    </div>
  );
}


