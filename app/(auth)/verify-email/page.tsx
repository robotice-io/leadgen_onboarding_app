"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { Mail, CheckCircle, KeyRound } from "lucide-react";
import { verifyEmail } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [tokenInUrl, setTokenInUrl] = useState<boolean>(false);
  const [emailFromSignup, setEmailFromSignup] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);

  // Check if verification code is in URL parameters
  useEffect(() => {
    const code = searchParams.get('token') || searchParams.get('code');
    const p = searchParams.get('pending');
    setPending(!!p);
    if (code) {
      setTokenInUrl(true);
      setVerificationCode(code);
      try {
        const stored = sessionStorage.getItem('signup_email') || localStorage.getItem('signup_email') || "";
        setEmailFromSignup(stored);
      } catch {}
      handleVerify(code, emailFromSignup || undefined);
    } else {
      try {
        const stored = sessionStorage.getItem('signup_email') || localStorage.getItem('signup_email') || "";
        setEmailFromSignup(stored);
      } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function handleVerify(code?: string, email?: string) {
    const codeToUse = code || verificationCode;
    if (!codeToUse) {
      setToast({ message: "Please enter a verification code", type: "error" });
      return;
    }

    setVerifying(true);
    
    try {
      const response = await verifyEmail(codeToUse, emailFromSignup || email);
      
      setVerified(true);
      setToast({ 
        message: response.message || t("verify.success" as any), 
        type: "success" 
      });
    } catch (err) {
      setToast({ 
        message: err instanceof Error ? err.message : t("verify.failed" as any), 
        type: "error" 
      });
    } finally {
      setVerifying(false);
    }
  }

  // Auto-redirect to login after successful verification
  useEffect(() => {
    if (verified) {
      const id = setTimeout(() => {
        // Send user to login with next to onboarding, so after login they land in the wizard
        router.push("/login?next=/onboarding");
      }, 1200);
      return () => clearTimeout(id);
    }
  }, [verified, router]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
              verified ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              {verified ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <Mail className="h-8 w-8 text-blue-600" />
              )}
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center mb-2">
            {verified
              ? t("verify.title.success" as any)
              : tokenInUrl
                ? t("verify.verifying.title" as any)
                : t("verify.title" as any)}
          </h1>
          <p className="text-sm text-black/60 dark:text-white/70 text-center">
            {verified
              ? t("verify.subtitle.success" as any)
              : tokenInUrl
                ? t("verify.verifying.subtitle" as any)
                : t("verify.subtitle" as any)}
          </p>
        </CardHeader>

        <CardBody>
          {verified ? (
            <div className="space-y-4 text-center">
              <div className="py-4">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex gap-3 justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-900 dark:text-green-100">
                      <p className="font-medium">{t("verify.success.title" as any)}</p>
                      <p className="text-green-800 dark:text-green-200">
                        {t("verify.success.subtitle" as any)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Link href="/login" className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  {t("verify.goToSignIn" as any)}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {!tokenInUrl ? (
                <>
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold">{t("verify.title" as any)}</h2>
                    <p className="text-sm text-black/60 dark:text-white/70">
                      {t("verify.subtitle" as any)}
                    </p>
                    {emailFromSignup && (
                      <p className="text-sm text-black/70 dark:text-white/80">
                        <span className="font-medium">{emailFromSignup}</span>
                      </p>
                    )}
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex gap-3">
                      <KeyRound className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900 dark:text-blue-100">
                        <p className="font-medium mb-1">{t("verify.how.title" as any)}</p>
                        <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
                          <li>{t("verify.how.s1" as any)}</li>
                          <li>{t("verify.how.s2" as any)}</li>
                          <li>{t("verify.how.s3" as any)}</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-black/60 dark:text-white/70 mb-3">
                      {t("verify.resend.prompt" as any)}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setToast({ message: t("verify.resend.soon" as any), type: "error" });
                      }}
                      loading={resending}
                    >
                      {t("verify.resend.cta" as any)}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-black/60 dark:text-white/70">
                    {t("verify.verifying.subtitle" as any)}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardBody>

        <CardFooter>
          <p className="text-sm text-center text-black/60 dark:text-white/70">
            <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              {t("verify.backToSignIn" as any)}
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-semibold text-center mb-2">Loading...</h1>
        </CardHeader>
        <CardBody>
          <div className="text-center py-4">
            <p className="text-sm text-black/60 dark:text-white/70">
              Loading verification form...
            </p>
          </div>
        </CardBody>
      </Card>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
