"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { Mail, CheckCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleResend() {
    setResending(true);
    
    try {
      // TODO: Implement resend verification email API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setToast({ message: "Verification email sent!", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to resend email", type: "error" });
    } finally {
      setResending(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center mb-2">Check Your Email</h1>
          <p className="text-sm text-black/60 dark:text-white/70 text-center">
            We've sent a verification link to your email address
          </p>
        </CardHeader>

        <CardBody>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <p className="font-medium mb-1">Next Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
                    <li>Check your inbox for the verification email</li>
                    <li>Click the verification link in the email</li>
                    <li>Return here to sign in</li>
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
                onClick={handleResend}
                loading={resending}
              >
                Resend Verification Email
              </Button>
            </div>
          </div>
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
