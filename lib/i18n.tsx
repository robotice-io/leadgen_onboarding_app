"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type SupportedLang = "es" | "en";

type Dictionary = Record<string, string>;

const ES: Dictionary = {
  brandName: "Robotice",
  tagline: "Asistente de configuración de correo",
  stepCompany: "Empresa",
  stepGuide: "Guía",
  stepConnect: "Conectar",

  letsGetStarted: "Comencemos",
  enterEmailAndCompany: "Ingresa tu correo y datos de la empresa para iniciar la configuración de Gmail API.",
  emailAddress: "Correo electrónico",
  companyName: "Nombre de empresa/marca",
  industryOptional: "Industria (opcional)",
  continueToTutorial: "Continuar al tutorial",

  tutorialTitle: "Tutorial de configuración de Gmail API",
  tutorialSubtitle: "Sigue este video paso a paso para habilitar el acceso a Gmail API.",
  checkEnableApi: "Habilita Gmail API en Google Cloud Console",
  checkCreateOAuth: "Crea credenciales OAuth 2.0",
  checkRedirectUris: "Configura URIs de redirección autorizados",
  checkDownloadJson: "Descarga el archivo JSON de credenciales",
  back: "Atrás",
  completedSetup: "Ya completé la configuración →",

  googleClientId: "ID de cliente de Google",
  googleClientSecret: "Secreto de cliente de Google",
  fromEmail: "Remitente (From)",
  redirectUri: "URI de redirección",
  save: "Guardar",
  saveAgain: "Guardar de nuevo",
  connectWithGoogle: "Conectar con Google",
  sendTestEmail: "Enviar correo de prueba",
  testEmailSent: "Correo de prueba enviado. Revisa tu bandeja.",
  tutorialChecklist: "Lista del tutorial:",
  saving: "Guardando",
  sending: "Enviando",
  send: "Enviar",
  savedNowConnect: "Guardado. Ahora conecta tu cuenta de Google.",
  pleaseSaveFirst: "Guarda primero para obtener un ID de integración.",
  unknownError: "Error desconocido",
  failedToSendTest: "Error al enviar el correo de prueba",
  clickToCopy: "Clic para copiar",
  copied: "¡Copiado!",
  companyCreated: "Empresa creada",
  companyExistsContinuing: "La empresa ya existe. Continuamos.",
  invalidCompany: "Nombre de empresa inválido",
  queuedEmail: "Correo encolado para envío",
  invalidEmailFields: "Revisa el correo/los campos",
  tryAgain: "Intentar de nuevo",
  loading: "Cargando",

  yourEmailPlaceholder: "tu.email@empresa.com",
  companyPlaceholder: "Nombre de tu empresa",
  industryPlaceholder: "Selecciona tu industria",
  googleConnected: "Conexión con Google exitosa. Refresh token guardado.",
};

const EN: Dictionary = {
  brandName: "Robotice",
  tagline: "Cold Email Setup Wizard",
  stepCompany: "Company",
  stepGuide: "Guide",
  stepConnect: "Connect",

  letsGetStarted: "Let's Get Started",
  enterEmailAndCompany: "Enter your email and company details to begin the Gmail API setup process.",
  emailAddress: "Email Address",
  companyName: "Company/Brand Name",
  industryOptional: "Industry (Optional)",
  continueToTutorial: "Continue to Tutorial",

  tutorialTitle: "Gmail API Setup Tutorial",
  tutorialSubtitle: "Follow this step-by-step video to enable Gmail API access for your account.",
  checkEnableApi: "Enable Gmail API in Google Cloud Console",
  checkCreateOAuth: "Create OAuth 2.0 credentials",
  checkRedirectUris: "Configure authorized redirect URIs",
  checkDownloadJson: "Download credentials JSON file",
  back: "Back",
  completedSetup: "I've Completed Setup →",

  googleClientId: "Google Client ID",
  googleClientSecret: "Google Client Secret",
  fromEmail: "From email",
  redirectUri: "Redirect URI",
  save: "Save",
  saveAgain: "Save again",
  connectWithGoogle: "Connect with Google",
  sendTestEmail: "Send test email",
  testEmailSent: "Test email sent. Check your inbox.",
  tutorialChecklist: "Tutorial Checklist:",
  saving: "Saving",
  sending: "Sending",
  send: "Send",
  savedNowConnect: "Saved. Now connect your Google account.",
  pleaseSaveFirst: "Please save first to get an integration ID.",
  unknownError: "Unknown error",
  failedToSendTest: "Failed to send test email",
  clickToCopy: "Click to copy",
  copied: "Copied!",
  companyCreated: "Company created",
  companyExistsContinuing: "Company already exists. Continuing.",
  invalidCompany: "Invalid company name",
  queuedEmail: "Email queued for sending",
  invalidEmailFields: "Check email/fields",
  tryAgain: "Try again",
  loading: "Loading",

  yourEmailPlaceholder: "your.email@company.com",
  companyPlaceholder: "Your company name",
  industryPlaceholder: "Select your industry",
  googleConnected: "Google connected successfully. Refresh token stored.",
};

const DICTS: Record<SupportedLang, Dictionary> = { es: ES, en: EN };

type I18nContextValue = {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: (key: keyof typeof ES) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>("es");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("robotice-lang") as SupportedLang | null;
      if (saved === "es" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = useCallback((l: SupportedLang) => {
    setLangState(l);
    try {
      localStorage.setItem("robotice-lang", l);
    } catch {}
  }, []);

  const t = useCallback(
    (key: keyof typeof ES) => {
      const dict = DICTS[lang];
      return dict[key] ?? (key as string);
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}


