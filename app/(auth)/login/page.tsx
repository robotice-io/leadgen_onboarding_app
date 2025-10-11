"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { login } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
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
      setToast({ message: "Login successful!", type: "success" });
      
      // Small delay to show success message, then redirect
      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center mb-2">Welcome Back</h1>
          <p className="text-sm text-black/60 dark:text-white/70 text-center">
            Sign in to your Robotice account
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
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Authentication Failed</p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="email"
              type="email"
              label="Email Address"
              placeholder="your.email@company.com"
              required
              autoComplete="email"
            />

            <Input
              name="password"
              type="password"
              label="Password"
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
                <span className="text-black/70 dark:text-white/70">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>
        </CardBody>

        <CardFooter>
          <p className="text-sm text-center text-black/60 dark:text-white/70">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              Sign up
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
