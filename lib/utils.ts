// Minimal className merge utility compatible with shadcn pattern
export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}
