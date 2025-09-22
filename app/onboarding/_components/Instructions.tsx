// @ts-nocheck
"use client";

import { useI18n } from "@/lib/i18n";
import { useMemo, useRef, useState } from "react";

function Shot({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt="Paso"
      className="w-full rounded-md border border-black/10 dark:border-white/10"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

function InstructionSection({ title, captions, prefix }: { title: string; captions: string[]; prefix: string }) {
  return (
    <section className="space-y-3">
      <h4 className="text-base font-semibold">{title}</h4>
      <ol className="list-decimal ml-5 space-y-3">
        {captions.map((c, i) => {
          const num = String(i + 1).padStart(2, "0");
          const base = `/guide/${prefix}-${num}`;
          return (
            <li key={i} className="space-y-2">
              <div>{c}</div>
              <Shot src={`${base}.png`} />
              <Shot src={`${base}.jpg`} />
              <Shot src={`${base}.webp`} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function Instructions() {
  const { t } = useI18n();
  const projectSteps = [t("help.project1"), t("help.project2"), t("help.project3"), t("help.project4"), t("help.project5")];
  const enableSteps = [t("help.enableApi1"), t("help.enableApi2"), t("help.enableApi3")];
  const consentSteps = [t("help.consent1"), t("help.consent2"), t("help.consent3"), t("help.consent4"), t("help.consent5"), t("help.consent6"), t("help.consent7"), t("help.consent8")];
  const credsSteps = [t("help.creds1"), t("help.creds2"), t("help.creds3"), t("help.creds4")];

  const [query, setQuery] = useState("");
  const sections = useMemo(() => [
    { id: "project", title: t("help.projectTitle") },
    { id: "enable", title: t("help.enableApiTitle") },
    { id: "consent", title: t("help.consentTitle") },
    { id: "creds", title: t("help.credsTitle") },
  ], [t]);
  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="max-h-[520px] overflow-y-auto rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/70 backdrop-blur p-3 border-b border-black/10 dark:border-white/10">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca en la guía..."
          className="w-full h-9 rounded-md border border-black/10 dark:border-white/15 bg-white/80 dark:bg-black/40 px-3 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {sections.map((s) => (
            <button key={s.id} onClick={() => goTo(s.id)} className="text-xs px-2 py-1 rounded border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10">
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div id="project">
          {!query || t("help.projectTitle").toLowerCase().includes(query.toLowerCase()) ? (
            <InstructionSection title={t("help.projectTitle")} captions={projectSteps} prefix="project" />
          ) : null}
        </div>
        <div id="enable">
          {!query || t("help.enableApiTitle").toLowerCase().includes(query.toLowerCase()) ? (
            <InstructionSection title={t("help.enableApiTitle")} captions={enableSteps} prefix="enable" />
          ) : null}
        </div>
        <div id="consent">
          {!query || t("help.consentTitle").toLowerCase().includes(query.toLowerCase()) ? (
            <InstructionSection title={t("help.consentTitle")} captions={consentSteps} prefix="consent" />
          ) : null}
        </div>
        <div id="creds">
          {!query || t("help.credsTitle").toLowerCase().includes(query.toLowerCase()) ? (
            <InstructionSection title={t("help.credsTitle")} captions={credsSteps} prefix="creds" />
          ) : null}
        </div>
      </div>
    </div>
  );
}


