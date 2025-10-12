"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { KeyRound, CheckCircle, Lock } from "lucide-react";
import { resetPassword } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Extract token from URL parameters
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!token) {
      newErrors.token = "Reset token is required";
    }
    
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(token, password);
      
      setSuccess(true);
      setToast({ 
        message: response.message || "Password reset successfully!", 
        type: "success" 
      });
      
      // Redirect to login after successful reset
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setToast({ 
        message: err instanceof Error ? err.message : "Password reset failed", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center mb-2">Password Reset Complete!</h1>
          <p className="text-sm text-black/60 dark:text-white/70 text-center">
            Your password has been successfully reset. Redirecting to login...
          </p>
        </CardHeader>

        <CardBody>
          <div className="text-center py-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex gap-3 justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-900 dark:text-green-100">
                  <p className="font-medium">Password Updated Successfully!</p>
                  <p className="text-green-800 dark:text-green-200">
                    You can now sign in with your new password.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>

        <CardFooter>
          <p className="text-sm text-center text-black/60 dark:text-white/70">
            <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              Go to Sign In
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
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center mb-2">Reset Your Password</h1>
          <p className="text-sm text-black/60 dark:text-white/70 text-center">
            Enter your new password below
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!token && (
              <Input
                name="token"
                type="text"
                label="Reset Token"
                placeholder="Enter reset token from email"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                error={errors.token}
              />
            )}

            <Input
              name="password"
              type="password"
              label="New Password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={errors.password}
              autoComplete="new-password"
            />

            <Input
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex gap-3">
                <KeyRound className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <p className="font-medium mb-1">Password Requirements:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                    <li>At least 8 characters long</li>
                    <li>Use a combination of letters, numbers, and symbols</li>
                    <li>Avoid common passwords or personal information</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Reset Password
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
