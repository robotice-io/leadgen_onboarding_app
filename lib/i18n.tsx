"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type SupportedLang = "es" | "en";

type Dictionary = Record<string, string>;

const ES: Dictionary = {
  brandName: "Robotice",
  tagline: "LeadGen Wizzard",
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
  alreadyLinkedTitle: "Cuenta ya enlazada",
  alreadyLinkedBody: "Esta cuenta ya está enlazada con Robotice. Si necesitas ayuda, contáctanos.",
  invalidCompany: "Nombre de empresa inválido",
  queuedEmail: "Correo encolado para envío",
  invalidEmailFields: "Revisa el correo/los campos",
  tryAgain: "Intentar de nuevo",
  loading: "Cargando",

  yourEmailPlaceholder: "tu.email@empresa.com",
  companyPlaceholder: "Nombre de tu empresa",
  industryPlaceholder: "Selecciona tu industria",
  googleConnected: "Conexión con Google exitosa. Refresh token guardado.",
  connectedHeadline: "¡Conectado con Google!",
  funnelTeaser: "¿Listo para acelerar tu embudo de ventas?",
  backToWizard: "Volver al asistente",
  // Help drawer
  "help.quickGuideTitle": "Guía rápida — Conectar Gmail",
  "help.close": "Cerrar",
  "help.requirementsTitle": "Requisitos",
  "help.req1": "Cuenta de Google (Gmail o Google Workspace).",
  "help.req2": "Cumple la política Google API Services User Data Policy.",
  "help.redirectUriTitle": "URI de redirección (copiar y pegar)",
  "help.credentialsTitle": "Opciones de credenciales",
  "help.credDefault": "Credenciales por defecto (dominio corporativo gestionado).",
  "help.credCustom": "Credenciales propias para @gmail (recomendado).",
  "help.projectTitle": "Crear proyecto en Google Cloud para Gmail",
  "help.project1": "Accede a Google Cloud Platform con tu cuenta.",
  "help.project2": "Create or select a project → New project.",
  "help.project3": "Define Project name y Location, y pulsa Create.",
  "help.project4": "Verifica que el proyecto esté seleccionado.",
  "help.project5": "Permiso necesario: serviceusage.services.enable.",
  "help.enableApiTitle": "Habilitar API de Gmail",
  "help.enableApi1": "APIs & Services → Library.",
  "help.enableApi2": "Busca Gmail API.",
  "help.enableApi3": "Pulsa Enable.",
  "help.consentTitle": "Configurar pantalla de consentimiento (OAuth)",
  "help.consent1": "Google Auth Platform → Get Started.",
  "help.consent2": "Overview → App information → nombre y correo → Next.",
  "help.consent3": "Audience: External → Next.",
  "help.consent4": "Contact information → tu correo → Next.",
  "help.consent5": "Finish → acepta la política → Continue → Create.",
  "help.consent6": "Create OAuth Client.",
  "help.consent7": "Branding → Authorized domains (si aplica).",
  "help.consent8": "Opcional: Audience → Test users.",
  "help.scopesTitle": "Scopes necesarios",
  "help.scopeUserinfoEmail": "https://www.googleapis.com/auth/userinfo.email",
  "help.scopeMail": "https://mail.google.com",
  "help.credsTitle": "Crear credenciales OAuth (cliente)",
  "help.creds1": "Google Auth Platform → Clients → + Create Client.",
  "help.creds2": "Application type: Web application.",
  "help.creds3": "Authorized redirect URIs → + Add URI.",
  "help.creds4": "Create y guarda Client ID y Client secret.",
  "help.connectRoboticeTitle": "Conectar en Robotice",
  "help.connect1": "Vuelve al asistente (Paso 3) y pulsa Conectar con Google.",
  "help.connect2": "Concede permisos y vuelve al callback.",
  "help.connect3": "Se verificará el token con Refresh.",
  
  // Dashboard translations
  "dashboard.title": "Panel de Control",
  "dashboard.welcome": "¡Bienvenido de vuelta! Aquí está lo que está pasando con tus campañas.",
  "dashboard.emailsSentToday": "Correos Enviados Hoy",
  "dashboard.opensToday": "Aperturas Hoy",
  "dashboard.openRate": "Tasa de Apertura",
  "dashboard.uniqueDevices": "Dispositivos Únicos",
  "dashboard.openRateTrend": "Tendencia de Tasa de Apertura",
  "dashboard.last7Days": "Rendimiento de los últimos 7 días (fechas de calendario precisas)",
  "dashboard.deviceBreakdown": "Desglose por Dispositivo",
  "dashboard.deviceBreakdownSubtitle": "Aperturas de correo por tipo de dispositivo",
  "dashboard.campaignPerformance": "Rendimiento de Campañas",
  "dashboard.campaignPerformanceSubtitle": "Campañas con mejor rendimiento este mes",
  "dashboard.comingSoon": "Próximamente",
  "dashboard.comingSoonDescription": "Los análisis de rendimiento de campañas estarán disponibles pronto",
  "dashboard.recentEmails": "Correos Recientes",
  "dashboard.recentEmailsSubtitle": "Actividad de correo más reciente y rendimiento",
  "dashboard.searchEmails": "Buscar correos...",
  "dashboard.allStatus": "Todos los Estados",
  "dashboard.sent": "Enviado",
  "dashboard.delivered": "Entregado",
  "dashboard.opened": "Abierto",
  "dashboard.clicked": "Hace clic",
  "dashboard.noEmailsFound": "No se encontraron correos",
  "dashboard.adjustSearch": "Intenta ajustar tus criterios de búsqueda o filtro",
  "dashboard.startSending": "Comienza a enviar correos para verlos aquí",
  "dashboard.viewDetails": "Ver Detalles",
  "dashboard.viewAllEmails": "Ver Todos los Correos",
  "dashboard.showing": "Mostrando",
  "dashboard.of": "de",
  "dashboard.emails": "correos",
  "dashboard.connectAccount": "Conectar Cuenta",
  "dashboard.setupGmail": "Configurar integración de Gmail",
  "dashboard.signOut": "Cerrar sesión",
  "dashboard.failedToLoad": "Error al cargar el panel de control",
  "dashboard.checkConnection": "Por favor verifica tu conexión e inténtalo de nuevo",
  
  // Settings translations
  "settings.title": "Configuración",
  "settings.subtitle": "Administra la información de tu cuenta y configuración de conexión",
  "settings.tenantInfo": "Información del Inquilino",
  "settings.tenantName": "Nombre de la Empresa",
  "settings.tenantEmail": "Correo Electrónico",
  "settings.tenantId": "ID del Inquilino",
  "settings.status": "Estado",
  "settings.connected": "Conectado",
  "settings.notConnected": "No Conectado",
  "settings.changePassword": "Cambiar Contraseña",
  "settings.currentPassword": "Contraseña Actual",
  "settings.enterCurrentPassword": "Ingresa tu contraseña actual",
  "settings.newPassword": "Nueva Contraseña",
  "settings.enterNewPassword": "Ingresa tu nueva contraseña",
  "settings.confirmPassword": "Confirmar Contraseña",
  "settings.confirmNewPassword": "Confirma tu nueva contraseña",
  "settings.updatePassword": "Actualizar Contraseña",
  "settings.changingPassword": "Cambiando contraseña...",
  "settings.passwordChanged": "Contraseña actualizada exitosamente",
  "settings.deleteConnection": "Eliminar Conexión",
  "settings.deleteConnectionWarning": "Esta acción eliminará permanentemente la conexión con Gmail",
  "settings.warning": "Advertencia",
  "settings.deleteConnectionDescription": "Esta acción eliminará permanentemente tu conexión con Gmail. No podrás enviar correos hasta que reconectes tu cuenta. Esta acción no se puede deshacer.",
  "settings.deletingConnection": "Eliminando conexión...",
  "settings.connectionDeleted": "Conexión eliminada exitosamente",
  "settings.confirmDeleteConnection": "¿Estás seguro de que quieres eliminar la conexión con Gmail? Esta acción no se puede deshacer.",
};

const EN: Dictionary = {
  brandName: "Robotice",
  tagline: "LeadGen Wizzard",
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
  alreadyLinkedTitle: "Account already linked",
  alreadyLinkedBody: "This account is already linked with Robotice. If you need help, contact us.",
  invalidCompany: "Invalid company name",
  queuedEmail: "Email queued for sending",
  invalidEmailFields: "Check email/fields",
  tryAgain: "Try again",
  loading: "Loading",

  yourEmailPlaceholder: "your.email@company.com",
  companyPlaceholder: "Your company name",
  industryPlaceholder: "Select your industry",
  googleConnected: "Google connected successfully. Refresh token stored.",
  connectedHeadline: "Connected with Google!",
  funnelTeaser: "Ready to accelerate your sales funnel?",
  backToWizard: "Back to the wizard",
  // Help drawer
  "help.quickGuideTitle": "Quick guide — Connect Gmail",
  "help.close": "Close",
  "help.requirementsTitle": "Requirements",
  "help.req1": "Google account (Gmail or Google Workspace).",
  "help.req2": "Complies with Google API Services User Data Policy.",
  "help.redirectUriTitle": "Redirect URI (copy and paste)",
  "help.credentialsTitle": "Credential options",
  "help.credDefault": "Default credentials (managed corporate domain).",
  "help.credCustom": "Custom credentials for @gmail (recommended).",
  "help.projectTitle": "Create a Google Cloud project for Gmail",
  "help.project1": "Sign in to Google Cloud Platform.",
  "help.project2": "Create or select a project → New project.",
  "help.project3": "Set Project name and Location, then Create.",
  "help.project4": "Ensure the new project is selected.",
  "help.project5": "Required permission: serviceusage.services.enable.",
  "help.enableApiTitle": "Enable Gmail API",
  "help.enableApi1": "APIs & Services → Library.",
  "help.enableApi2": "Search Gmail API.",
  "help.enableApi3": "Click Enable.",
  "help.consentTitle": "Configure OAuth consent screen",
  "help.consent1": "Google Auth Platform → Get Started.",
  "help.consent2": "Overview → App information → name and email → Next.",
  "help.consent3": "Audience: External → Next.",
  "help.consent4": "Contact information → your email → Next.",
  "help.consent5": "Finish → accept policy → Continue → Create.",
  "help.consent6": "Create OAuth Client.",
  "help.consent7": "Branding → Authorized domains (if applicable).",
  "help.consent8": "Optional: Audience → Test users.",
  "help.scopesTitle": "Required scopes",
  "help.scopeUserinfoEmail": "https://www.googleapis.com/auth/userinfo.email",
  "help.scopeMail": "https://mail.google.com",
  "help.credsTitle": "Create OAuth client credentials",
  "help.creds1": "Google Auth Platform → Clients → + Create Client.",
  "help.creds2": "Application type: Web application.",
  "help.creds3": "Authorized redirect URIs → + Add URI.",
  "help.creds4": "Create and store Client ID and Client secret.",
  "help.connectRoboticeTitle": "Connect in Robotice",
  "help.connect1": "Back to the wizard (Step 3) → Connect with Google.",
  "help.connect2": "Grant consent and return to the callback.",
  "help.connect3": "Token will be verified via Refresh.",
  
  // Dashboard translations
  "dashboard.title": "Dashboard",
  "dashboard.welcome": "Welcome back! Here's what's happening with your campaigns.",
  "dashboard.emailsSentToday": "Emails Sent Today",
  "dashboard.opensToday": "Opens Today",
  "dashboard.openRate": "Open Rate",
  "dashboard.uniqueDevices": "Unique Devices",
  "dashboard.openRateTrend": "Open Rate Trend",
  "dashboard.last7Days": "Last 7 days performance (accurate calendar dates)",
  "dashboard.deviceBreakdown": "Device Breakdown",
  "dashboard.deviceBreakdownSubtitle": "Email opens by device type",
  "dashboard.campaignPerformance": "Campaign Performance",
  "dashboard.campaignPerformanceSubtitle": "Top performing campaigns this month",
  "dashboard.comingSoon": "Coming Soon",
  "dashboard.comingSoonDescription": "Campaign performance analytics will be available soon",
  "dashboard.recentEmails": "Recent Emails",
  "dashboard.recentEmailsSubtitle": "Latest email activity and performance",
  "dashboard.searchEmails": "Search emails...",
  "dashboard.allStatus": "All Status",
  "dashboard.sent": "Sent",
  "dashboard.delivered": "Delivered",
  "dashboard.opened": "Opened",
  "dashboard.clicked": "Clicked",
  "dashboard.noEmailsFound": "No emails found",
  "dashboard.adjustSearch": "Try adjusting your search or filter criteria",
  "dashboard.startSending": "Start sending emails to see them here",
  "dashboard.viewDetails": "View Details",
  "dashboard.viewAllEmails": "View All Emails",
  "dashboard.showing": "Showing",
  "dashboard.of": "of",
  "dashboard.emails": "emails",
  "dashboard.connectAccount": "Connect Account",
  "dashboard.setupGmail": "Setup Gmail integration",
  "dashboard.signOut": "Sign out",
  "dashboard.failedToLoad": "Failed to load dashboard",
  "dashboard.checkConnection": "Please check your connection and try again",
  
  // Settings translations
  "settings.title": "Settings",
  "settings.subtitle": "Manage your account information and connection settings",
  "settings.tenantInfo": "Tenant Information",
  "settings.tenantName": "Company Name",
  "settings.tenantEmail": "Email Address",
  "settings.tenantId": "Tenant ID",
  "settings.status": "Status",
  "settings.connected": "Connected",
  "settings.notConnected": "Not Connected",
  "settings.changePassword": "Change Password",
  "settings.currentPassword": "Current Password",
  "settings.enterCurrentPassword": "Enter your current password",
  "settings.newPassword": "New Password",
  "settings.enterNewPassword": "Enter your new password",
  "settings.confirmPassword": "Confirm Password",
  "settings.confirmNewPassword": "Confirm your new password",
  "settings.updatePassword": "Update Password",
  "settings.changingPassword": "Changing password...",
  "settings.passwordChanged": "Password updated successfully",
  "settings.deleteConnection": "Delete Connection",
  "settings.deleteConnectionWarning": "This action will permanently delete the Gmail connection",
  "settings.warning": "Warning",
  "settings.deleteConnectionDescription": "This action will permanently delete your Gmail connection. You won't be able to send emails until you reconnect your account. This action cannot be undone.",
  "settings.deletingConnection": "Deleting connection...",
  "settings.connectionDeleted": "Connection deleted successfully",
  "settings.confirmDeleteConnection": "Are you sure you want to delete the Gmail connection? This action cannot be undone.",
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


