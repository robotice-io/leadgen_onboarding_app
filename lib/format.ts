"use client";
import { SupportedLang } from "./i18n";

export function formatNumber(value: number, lang: SupportedLang) {
  try {
    const locale = lang === "es" ? "es-ES" : "en-US";
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return String(value);
  }
}
