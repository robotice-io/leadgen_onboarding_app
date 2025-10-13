"use client";

import { useI18n } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/10 px-1 py-1">
        <button
          type="button"
          onClick={() => setLang("es")}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            lang === "es" ? "bg-white text-black shadow-sm dark:bg-white/90" : "text-black/70 dark:text-white/80"
          }`}
        >
          ES
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            lang === "en" ? "bg-white text-black shadow-sm dark:bg-white/90" : "text-black/70 dark:text-white/80"
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
