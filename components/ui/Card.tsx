import { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`
      bg-white/90 dark:bg-black/30 backdrop-blur rounded-xl 
      shadow-sm border border-black/5 dark:border-white/10 
      p-6 sm:p-8
      ${className}
    `}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return (
    <div className={`mb-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }: CardProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "" }: CardProps) {
  return (
    <div className={`mt-6 ${className}`}>
      {children}
    </div>
  );
}
