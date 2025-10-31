// Simple classnames merger utility used across UI components
// Accepts any number of className strings and filters out falsy values
export function cn(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(" ");
}

