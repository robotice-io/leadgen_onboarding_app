"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      // TODO: Implement forgot password API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setToast({ message: "Password reset link sent!", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to send reset link", type: "error" });
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
          <h1 className="text-2xl font-semibold text-center mb-2">Check Your Email</h1>
          <p className="text-sm text-black/60 dark:text-white/70 text-center">
            We've sent password reset instructions to your email
          </p>
        </CardHeader>

        <CardFooter>
          <p className="text-sm text-center text-black/60 dark:text-white/70">
            <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              Back to Sign In
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
          <h1 className="text-2xl font-semibold text-center mb-2">Reset Password</h1>
          <p className="text-sm text-black/60 dark:text-white/70 text-center">
            Enter your email and we'll send you a reset link
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="email"
              type="email"
              label="Email Address"
              placeholder="your.email@company.com"
              required
              autoComplete="email"
            />

            <Button type="submit" fullWidth loading={loading}>
              Send Reset Link
            </Button>
          </form>
        </CardBody>

        <CardFooter>
          <p className="text-sm text-center text-black/60 dark:text-white/70">
            Remember your password?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              Sign in
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
