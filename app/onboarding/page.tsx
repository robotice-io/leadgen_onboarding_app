import Wizard from "./_components/Wizard";
import { I18nProvider, useI18n } from "@/lib/i18n";

export default function OnboardingPage() {
  return (
    <I18nProvider>
      <div className="min-h-screen w-full bg-[linear-gradient(180deg,rgba(2,6,23,0)_0%,rgba(2,6,23,0)_60%,rgba(2,6,23,0.03)_100%)]">
        <TopBar />
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8 py-6 sm:py-10">
          <Wizard />
        </div>
      </div>
    </I18nProvider>
  );
}

function TopBar() {
  const { lang, setLang, t } = useI18n();
  return (
    <header className="w-full border-b border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoMark />
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

function LogoMark() {
  return (
    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white grid grid-cols-2 grid-rows-2 gap-1 p-1">
      <div className="rounded-sm bg-white/90" />
      <div className="rounded-sm bg-white/90" />
      <div className="rounded-sm bg-white/90" />
      <div className="rounded-sm bg-white/90" />
    </div>
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



