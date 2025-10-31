"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Button as AriaButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";

// Unified brand button: prefer black or white surfaces depending on context
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors",
    // disabled
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    // focus visible
    "data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2",
    // reset
    "focus-visible:outline-none",
  ],
  {
    variants: {
      variant: {
        // Shadcn defaults kept for compat
        default:
          "bg-primary text-primary-foreground data-[hovered]:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground data-[hovered]:bg-destructive/90",
        outline:
          "border border-input bg-background data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground data-[hovered]:bg-secondary/80",
        ghost:
          "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
        link: "text-primary underline-offset-4 data-[hovered]:underline",
        // Brand-tight variants
        black:
          "bg-black text-white border border-black/80 data-[hovered]:bg-black/90 dark:border-white/20",
        white:
          "bg-white text-black border border-white/30 data-[hovered]:bg-white/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-7",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "black",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends AriaButtonProps,
    VariantProps<typeof buttonVariants> {}

export const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <AriaButton
      className={composeRenderProps(className, (className) =>
        cn(
          buttonVariants({
            variant,
            size,
            className,
          })
        )
      )}
      {...props}
    />
  );
};

export type { ButtonProps as AriaButtonProps };
