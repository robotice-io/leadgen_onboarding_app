import { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ 
  label, 
  error, 
  helperText,
  className = "",
  ...props 
}: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-black dark:text-white">
          {label}
        </label>
      )}
      <input
        className={`
          w-full rounded-md border px-3 py-2 outline-none transition-all
          ${error 
            ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
            : 'border-black/10 dark:border-white/15 focus:ring-2 focus:ring-blue-600'
          }
          bg-white dark:bg-black/20
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-black/60 dark:text-white/60">{helperText}</p>
      )}
    </div>
  );
}
