import Wizard from "./_components/Wizard";
import { I18nProvider } from "@/lib/i18n";
import TopBar from "./_components/TopBar";

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

// TopBar moved to a Client Component to avoid server-side hook usage



