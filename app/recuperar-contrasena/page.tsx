import { redirect } from "next/navigation";

// Spanish-friendly route that redirects to the actual reset password form.
// Preserves `?token=...` if present
export default function RecuperarContrasena({ searchParams }: { searchParams?: { token?: string } }) {
  const token = searchParams?.token;
  if (token) return redirect(`/reset-password?token=${encodeURIComponent(token)}`);
  return redirect("/reset-password");
}
