"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Dynamic route to support links like /reset-password/<token>
// It immediately redirects to /reset-password?token=<token>
export default function ResetPasswordTokenPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  useEffect(() => {
    if (params?.token) {
      router.replace(`/reset-password?token=${encodeURIComponent(params.token)}`);
    } else {
      router.replace(`/reset-password`);
    }
  }, [params, router]);
  return null;
}
