"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { login } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      setToast({ message: t("login.success"), type: "success" });
      
      // After login, go to next if provided, else post-login
      const next = searchParams.get("next");
      setTimeout(() => {
        if (next && /^\//.test(next)) {
          window.location.href = next;
        } else {
          window.location.href = "/post-login";
        }
      }, 800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      // If backend enforces verified-only and returns a message like "Email not verified"
      if (/not\s*verified|verify\s*your\s*email/i.test(msg)) {
        try { sessionStorage.setItem("signup_email", String(formData.get("email") || "")); } catch {}
        window.location.href = "/verify-email?pending=1";
        return;
      }
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center mb-2">{t("login.welcomeBack")}</h1>
          <p className="text-sm text-black/60 dark:text-white/70 text-center">
            {t("login.signInSubtitle")}
          </p>
        </CardHeader>

        <CardBody>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2">
                <svg className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">{t("login.authFailed")}</p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="email"
              type="email"
              label={t("login.emailAddress")}
              placeholder={t("login.emailPlaceholder")}
              required
              autoComplete="email"
            />

            <Input
              name="password"
              type="password"
              label={t("login.password")}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-4 w-4 rounded border-black/25 dark:border-white/25 accent-blue-600"
                />
                <span className="text-black/70 dark:text-white/70">{t("login.rememberMe")}</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {t("login.forgotPassword")}
              </Link>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              {t("login.signIn")}
            </Button>
          </form>
        </CardBody>

        <CardFooter>
          <p className="text-sm text-center text-black/60 dark:text-white/70">
            {t("login.noAccount")} {" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              {t("login.signUp")}
            </Link>
          </p>
        </CardFooter>
      </Card>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-black/60 dark:text-white/70">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
