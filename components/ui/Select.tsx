"use client";

import {
  Select as AriaSelect,
  Button as AriaButton,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  SelectValue,
  type Key,
} from "react-aria-components";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export type Option = { id: string; label: string } | string;

export type SelectProps = {
  label?: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
};

function toId(opt: Option) {
  return typeof opt === "string" ? opt : opt.id;
}
function toLabel(opt: Option) {
  return typeof opt === "string" ? opt : opt.label;
}

export function Select({ label, placeholder = "--", options, value, onChange, className }: SelectProps) {
  return (
    <AriaSelect
      selectedKey={value as Key | undefined}
      onSelectionChange={(k) => onChange?.(String(k))}
      className={cn("w-full", className)}
    >
      {label ? (
        <Label className="mb-1 block text-sm font-medium text-black dark:text-white">{label}</Label>
      ) : null}
      <AriaButton
        className={cn(
          "group relative w-full h-11 rounded-md border px-3 text-left",
          "border-black/10 dark:border-white/15 bg-white dark:bg-black/20",
          "outline-none transition-colors data-[focus-visible]:ring-2 data-[focus-visible]:ring-blue-600",
          "flex items-center justify-between",
        )}
      >
        <span className={cn("truncate", !value && "text-black/50 dark:text-white/50")}> 
          <SelectValue>{(v) => (v ? String(v) : placeholder)}</SelectValue>
        </span>
        <ChevronDown className="h-4 w-4 opacity-70 group-data-[pressed]:translate-y-px transition-transform" />
      </AriaButton>
      <Popover
        className={cn(
          "z-50 mt-2 w-[--trigger-width] overflow-hidden rounded-md border",
          "border-black/10 dark:border-white/10 bg-white/95 dark:bg-black/90 backdrop-blur",
          "shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]",
        )}
      >
        <ListBox className="max-h-64 overflow-auto p-1 text-sm">
          {options.map((opt) => (
            <ListBoxItem
              key={toId(opt)}
              id={toId(opt)}
              className={cn(
                "group cursor-default select-none rounded-md px-2 py-2 outline-none",
                "data-[focused]:bg-black/5 dark:data-[focused]:bg-white/10",
                "data-[selected]:bg-blue-600 data-[selected]:text-white",
              )}
            >
              {toLabel(opt)}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export default Select;
