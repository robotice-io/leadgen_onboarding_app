import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = "primary",
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400",
    secondary: "border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
  };
  
  return (
    <button 
      className={`
        relative h-11 px-4 rounded-md transition-all font-medium
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      <span className={loading ? "opacity-0" : ""}>{children}</span>
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <span className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
        </span>
      )}
    </button>
  );
}
