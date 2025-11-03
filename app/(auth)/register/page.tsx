"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { register } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (password.length < 8) {
      newErrors.password = t("register.error.passwordMin" as any);
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t("register.error.passwordsMismatch" as any);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await register(email, password, firstName, lastName);
      
      setToast({ 
        message: response.message || t("register.success" as any), 
        type: "success" 
      });
      
      setTimeout(() => {
        try { sessionStorage.setItem("signup_email", email); } catch {}
        window.location.href = "/verify-email?pending=1";
      }, 2000);
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : t("register.failed" as any),
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center mb-2">{t("register.title" as any)}</h1>
          <p className="text-sm text-black/60 dark:text-white/70 text-center">{t("register.subtitle" as any)}</p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                type="text"
                label={t("register.firstName" as any)}
                placeholder={t("register.firstName.placeholder" as any)}
                autoComplete="given-name"
              />
              <Input
                name="lastName"
                type="text"
                label={t("register.lastName" as any)}
                placeholder={t("register.lastName.placeholder" as any)}
                autoComplete="family-name"
              />
            </div>

            <Input
              name="email"
              type="email"
              label={t("emailAddress" as any)}
              placeholder={t("login.emailPlaceholder" as any)}
              required
              autoComplete="email"
              error={errors.email}
            />

            <Input
              name="password"
              type="password"
              label={t("register.password" as any)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              error={errors.password}
              helperText={t("register.password.helper" as any)}
            />

            <Input
              name="confirmPassword"
              type="password"
              label={t("register.confirmPassword" as any)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              error={errors.confirmPassword}
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                name="terms"
                required
                className="mt-1 h-4 w-4 rounded border-black/25 dark:border-white/25 accent-blue-600"
              />
              <label className="text-sm text-black/70 dark:text-white/70">
                {t("register.terms.text" as any)}{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  {t("register.terms.ofService" as any)}
                </Link>{" "}
                {t("register.terms.and" as any)}{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  {t("register.terms.privacy" as any)}
                </Link>
              </label>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              {t("register.cta" as any)}
            </Button>
          </form>
        </CardBody>

        <CardFooter>
          <p className="text-sm text-center text-black/60 dark:text-white/70">
            {t("register.haveAccount" as any)}{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              {t("register.signIn" as any)}
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
