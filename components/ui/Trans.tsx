"use client";
import React from "react";
import { useI18n } from "@/lib/i18n";

// Wrapper <Trans k="landing.hero.title" highlightClass="..." />
// Permite usar marcadores [hl] ... [hl] en las traducciones para aplicar estilos especiales.
// Ejemplo clave: "Genera [hl]leads B2B reales[hl] con automatización".

interface TransProps {
  k: string; // clave de traducción
  highlightClass?: string;
  as?: React.ElementType;
  className?: string;
}

export function Trans({ k, highlightClass = "bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent", as = "span", className }: TransProps) {
  const { t } = useI18n();
  const raw = t(k as any);
  const parts = raw.split(/\[hl\]/g); // alterna texto normal y destacado

  const Tag: any = as;
  let highlight = false;

  return (
    <Tag className={className}>
      {parts.map((segment, i) => {
        if (segment === "") return null;
        highlight = !highlight; // flip each time due to split pattern
        // pattern: text [hl] highlight [hl] text -> split -> [text, highlight, text]
        // After split first toggle gives highlight=true for highlighted chunk
        if (i === 0 && raw.startsWith("[hl]")) {
          // If starts with [hl], first part is highlight
        }
        const isHighlight = raw.startsWith("[hl]") ? (i % 2 === 0) : (i % 2 === 1);
        return isHighlight ? (
          <span key={i} className={highlightClass}>{segment}</span>
        ) : (
          <React.Fragment key={i}>{segment}</React.Fragment>
        );
      })}
    </Tag>
  );
}
