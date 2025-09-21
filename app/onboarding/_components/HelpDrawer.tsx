"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";

export default function HelpDrawer({ open, onClose, redirectUri, apiBase }: { open: boolean; onClose: () => void; redirectUri: string; apiBase: string; }) {
  const { t } = useI18n();
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-black/95 text-black dark:text-white shadow-xl border-l border-black/10 dark:border-white/10 transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10">
            <h3 className="text-base font-semibold">{t("help.quickGuideTitle")}</h3>
            <button className="text-sm opacity-80 hover:opacity-100" onClick={onClose}>{t("help.close")}</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm leading-6">
            <Section title={t("help.requirementsTitle")}>
              <ul className="list-disc ml-5 space-y-1">
                <li>{t("help.req1")}</li>
                <li>{t("help.req2")}</li>
              </ul>
            </Section>

            <Section title={t("help.redirectUriTitle")}>
              <CopyLine value={`${apiBase.replace(/\/$/, "")}/api/v1/oauth/callback`} />
            </Section>

            <Section title={t("help.credentialsTitle")}>
              <ol className="list-decimal ml-5 space-y-2">
                <li>{t("help.credDefault")}</li>
                <li>{t("help.credCustom")}</li>
              </ol>
            </Section>

            <Section title={t("help.projectTitle")}>
              <ol className="list-decimal ml-5 space-y-2">
                <li>{t("help.project1")}</li>
                <li>{t("help.project2")}</li>
                <li>{t("help.project3")}</li>
                <li>{t("help.project4")}</li>
                <li>{t("help.project5")}</li>
              </ol>
            </Section>

            <Section title={t("help.enableApiTitle")}>
              <ol className="list-decimal ml-5 space-y-2">
                <li>{t("help.enableApi1")}</li>
                <li>{t("help.enableApi2")}</li>
                <li>{t("help.enableApi3")}</li>
              </ol>
            </Section>

            <Section title={t("help.consentTitle")}>
              <ol className="list-decimal ml-5 space-y-2">
                <li>{t("help.consent1")}</li>
                <li>{t("help.consent2")}</li>
                <li>{t("help.consent3")}</li>
                <li>{t("help.consent4")}</li>
                <li>{t("help.consent5")}</li>
                <li>{t("help.consent6")}</li>
                <li>{t("help.consent7")}</li>
                <li>{t("help.consent8")}</li>
                <li>{t("help.scopesTitle")}:
                  <div className="mt-2 space-y-2">
                    <CopyLine value={t("help.scopeUserinfoEmail")} />
                    <CopyLine value={t("help.scopeMail")} />
                  </div>
                </li>
              </ol>
            </Section>

            <Section title={t("help.credsTitle")}>
              <ol className="list-decimal ml-5 space-y-2">
                <li>{t("help.creds1")}</li>
                <li>{t("help.creds2")}</li>
                <li>{t("help.creds3")}:
                  <CopyLine value={`${apiBase.replace(/\/$/, "")}/api/v1/oauth/callback`} className="mt-2" />
                </li>
                <li>{t("help.creds4")}</li>
              </ol>
            </Section>

            <Section title={t("help.connectRoboticeTitle")}>
              <ol className="list-decimal ml-5 space-y-2">
                <li>{t("help.connect1")}</li>
                <li>{t("help.connect2")}</li>
                <li>{t("help.connect3")}</li>
              </ol>
            </Section>
          </div>
        </div>
      </aside>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="font-semibold mb-2">{title}</h4>
      <div>{children}</div>
    </section>
  );
}

function CopyLine({ value, className = "" }: { value: string; className?: string }) {
  return (
    <button
      type="button"
      className={`w-full text-left font-mono text-[11px] break-all p-2 rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/40 hover:bg-black/5 dark:hover:bg-white/10 transition ${className}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {}
      }}
      title="Clic para copiar"
    >
      {value}
    </button>
  );
}


