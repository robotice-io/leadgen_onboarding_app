import TopBar from "../_components/TopBar";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function AlreadyLinkedPage() {
  return (
    <I18nProvider>
      <div className="min-h-screen w-full bg-[linear-gradient(180deg,rgba(2,6,23,0)_0%,rgba(2,6,23,0)_60%,rgba(2,6,23,0.03)_100%)]">
        <TopBar />
        <div className={`mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8 mt-[30px] py-6 sm:py-10 ${poppins.className} bg-[radial-gradient(ellipse_at_20%_0%,rgba(59,130,246,0.10)_0%,transparent_40%),radial-gradient(ellipse_at_80%_100%,rgba(59,130,246,0.08)_0%,transparent_45%)] rounded-xl` }>
          <Card>
            <AlreadyLinkedContent />
          </Card>
        </div>
      </div>
    </I18nProvider>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/90 dark:bg-black/30 backdrop-blur rounded-xl shadow-sm border border-black/5 dark:border-white/10 p-6 sm:p-8">
      {children}
    </div>
  );
}

function AlreadyLinkedContent() {
  const { t } = useI18n();
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold mb-2">{t("alreadyLinkedTitle")}</h1>
      <p className="text-sm text-black/70 dark:text-white/70">{t("alreadyLinkedBody")}</p>
    </div>
  );
}


