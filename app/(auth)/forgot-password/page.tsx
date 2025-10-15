"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { KeyRound } from "lucide-react";
import { forgotPassword } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const response = await forgotPassword(email);
      
      setSubmitted(true);
      setToast({ 
        message: response.message || t("forgot.success" as any), 
        type: "success" 
      });
    } catch (err) {
      setToast({ 
        message: err instanceof Error ? err.message : t("forgot.failed" as any), 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <KeyRound className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center mb-2">{t("forgot.sent.title" as any)}</h1>
          <p className="text-sm text-black/60 dark:text-white/70 text-center">{t("forgot.sent.subtitle" as any)}</p>
        </CardHeader>

        <CardFooter>
          <p className="text-sm text-center text-black/60 dark:text-white/70">
            <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              {t("forgot.backToSignIn" as any)}
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center mb-2">{t("forgot.title" as any)}</h1>
          <p className="text-sm text-black/60 dark:text-white/70 text-center">{t("forgot.subtitle" as any)}</p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="email"
              type="email"
              label={t("forgot.email.label" as any)}
              placeholder={t("forgot.email.placeholder" as any)}
              required
              autoComplete="email"
            />

            <Button type="submit" fullWidth loading={loading}>
              {t("forgot.cta" as any)}
            </Button>
          </form>
        </CardBody>

        <CardFooter>
          <p className="text-sm text-center text-black/60 dark:text-white/70">
            {t("forgot.remember" as any)}{" "}
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
