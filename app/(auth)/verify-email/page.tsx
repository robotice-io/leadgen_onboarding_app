"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { Mail, CheckCircle, KeyRound } from "lucide-react";
import { verifyEmail } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Check if verification code is in URL parameters
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setVerificationCode(code);
      handleVerify(code);
    }
  }, [searchParams]);

  async function handleVerify(code?: string) {
    const codeToUse = code || verificationCode;
    if (!codeToUse) {
      setToast({ message: "Please enter a verification code", type: "error" });
      return;
    }

    setVerifying(true);
    
    try {
      const response = await verifyEmail(codeToUse);
      
      setVerified(true);
      setToast({ 
        message: response.message || "Email verified successfully!", 
        type: "success" 
      });
      
      // Redirect to login after successful verification
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setToast({ 
        message: err instanceof Error ? err.message : "Verification failed", 
        type: "error" 
      });
    } finally {
      setVerifying(false);
    }
  }

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
            {verified ? "Email Verified!" : "Verify Your Email"}
          </h1>
          <p className="text-sm text-black/60 dark:text-white/70 text-center">
            {verified 
              ? "Your email has been successfully verified. Redirecting to login..."
              : "Enter the verification code from your email or click the link in your email"
            }
          </p>
        </CardHeader>

        <CardBody>
          {verified ? (
            <div className="text-center py-4">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex gap-3 justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-900 dark:text-green-100">
                    <p className="font-medium">Verification Complete!</p>
                    <p className="text-green-800 dark:text-green-200">
                      You can now sign in to your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <Input
                  name="verificationCode"
                  type="text"
                  label="Verification Code"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
                
                <Button 
                  type="button"
                  onClick={() => handleVerify()}
                  loading={verifying}
                  fullWidth
                >
                  Verify Email
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                  <KeyRound className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-medium mb-1">How to verify:</p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
                      <li>Check your inbox for the verification email</li>
                      <li>Click the verification link in the email (automatic)</li>
                      <li>Or copy the verification code and paste it above</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-black/60 dark:text-white/70 mb-3">
                  Didn't receive the email?
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement resend verification email API call
                    setToast({ message: "Resend functionality coming soon", type: "error" });
                  }}
                  loading={resending}
                >
                  Resend Verification Email
                </Button>
              </div>
            </div>
          )}
        </CardBody>

        <CardFooter>
          <p className="text-sm text-center text-black/60 dark:text-white/70">
            <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              Back to Sign In
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
