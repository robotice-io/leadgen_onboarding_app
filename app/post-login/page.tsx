"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserTenant } from "@/lib/auth-client";

export default function PostLoginGate() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        const tenant = await getUserTenant();

        if (tenant?.onboarding_status === "completed") {
          router.replace("/dashboard");
        } else {
          const step = tenant?.onboarding_step || 1;
          router.replace(`/onboarding?step=${step}`);
        }
      } catch (e) {
        console.error("Failed to check onboarding status:", e);
        setError("Failed to check account status");
        router.replace("/onboarding");
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking your account status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => (window.location.href = "/onboarding")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Continue to Onboarding
          </button>
        </div>
      </div>
    );
  }

  return null;
}
