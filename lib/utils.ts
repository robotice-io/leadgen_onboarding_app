// Minimal className merge utility compatible with shadcn/ui pattern
// If you prefer full-featured merging, install:
//   npm i clsx tailwind-merge
// and replace this with: export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function cn(...inputs: Array<string | false | null | undefined>) {
	return inputs.filter(Boolean).join(" ");
}
