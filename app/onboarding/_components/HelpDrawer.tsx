// @ts-nocheck
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function HelpDrawer({ open, onClose, redirectUri, apiBase }: { open: boolean; onClose: () => void; redirectUri: string; apiBase: string; }) {
  const { t } = useI18n();
  const [query, setQuery] = useState<string>("");
  const tocRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const sections = useMemo(() => [
    { id: "req", title: t("help.requirementsTitle") },
    { id: "redir", title: t("help.redirectUriTitle") },
    { id: "cred", title: t("help.credentialsTitle") },
    { id: "proj", title: t("help.projectTitle") },
    { id: "enable", title: t("help.enableApiTitle") },
    { id: "consent", title: t("help.consentTitle") },
    { id: "creds", title: t("help.credsTitle") },
    { id: "robotice", title: t("help.connectRoboticeTitle") },
  ], [t]);

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
          <div className="p-4 border-b border-black/10 dark:border-white/10">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en la guía..."
              className="w-full h-9 rounded-md border border-black/10 dark:border-white/15 bg-white/80 dark:bg-black/40 px-3 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            />
            <div ref={tocRef} className="mt-3 flex flex-wrap gap-2">
              {sections.map((s) => (
                <button key={s.id} onClick={() => {
                  const el = document.getElementById(s.id);
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                  className="text-xs px-2 py-1 rounded border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10">
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm leading-6">
            <Section id="req" title={t("help.requirementsTitle")} hidden={query && !t("help.requirementsTitle").toLowerCase().includes(query.toLowerCase())}>
              <ul className="list-disc ml-5 space-y-1">
                <li>{t("help.req1")}</li>
                <li>{t("help.req2")}</li>
              </ul>
            </Section>

            <Section id="redir" title={t("help.redirectUriTitle")} hidden={query && !t("help.redirectUriTitle").toLowerCase().includes(query.toLowerCase())}>
              <CopyLine value={`${apiBase.replace(/\/$/, "")}/api/v1/oauth/callback`} />
            </Section>

            <Section id="cred" title={t("help.credentialsTitle")} hidden={query && !t("help.credentialsTitle").toLowerCase().includes(query.toLowerCase())}>
              <ol className="list-decimal ml-5 space-y-2">
                <li>{t("help.credDefault")}</li>
                <li>{t("help.credCustom")}</li>
              </ol>
            </Section>

            <Section id="proj" title={t("help.projectTitle")} hidden={query && !t("help.projectTitle").toLowerCase().includes(query.toLowerCase())}>
              <ol className="list-decimal ml-5 space-y-2">
                <li>{t("help.project1")}</li>
                <li>{t("help.project2")}</li>
                <li>{t("help.project3")}</li>
                <li>{t("help.project4")}</li>
                <li>{t("help.project5")}</li>
              </ol>
            </Section>

            <Section id="enable" title={t("help.enableApiTitle")} hidden={query && !t("help.enableApiTitle").toLowerCase().includes(query.toLowerCase())}>
              <ol className="list-decimal ml-5 space-y-2">
                <li>{t("help.enableApi1")}</li>
                <li>{t("help.enableApi2")}</li>
                <li>{t("help.enableApi3")}</li>
              </ol>
            </Section>

            <Section id="consent" title={t("help.consentTitle")} hidden={query && !t("help.consentTitle").toLowerCase().includes(query.toLowerCase())}>
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

            <Section id="creds" title={t("help.credsTitle")} hidden={query && !t("help.credsTitle").toLowerCase().includes(query.toLowerCase())}>
              <ol className="list-decimal ml-5 space-y-2">
                <li>{t("help.creds1")}</li>
                <li>{t("help.creds2")}</li>
                <li>{t("help.creds3")}:
                  <CopyLine value={`${apiBase.replace(/\/$/, "")}/api/v1/oauth/callback`} className="mt-2" />
                </li>
                <li>{t("help.creds4")}</li>
              </ol>
            </Section>

            <Section id="robotice" title={t("help.connectRoboticeTitle")} hidden={query && !t("help.connectRoboticeTitle").toLowerCase().includes(query.toLowerCase())}>
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

function Section({ id, title, children, hidden }: { id?: string; title: string; children: React.ReactNode; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <section id={id}>
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


