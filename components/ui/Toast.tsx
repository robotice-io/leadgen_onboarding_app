"use client";

import { useEffect } from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = "info", onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600"
  };

  return (
    <div 
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        text-white px-4 py-3 rounded-md shadow-lg
        animate-in slide-in-from-bottom-5 fade-in
        ${styles[type]}
      `}
      role="status"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{message}</span>
        <button 
          className="text-white/90 hover:text-white text-xs underline"
          onClick={onClose}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
