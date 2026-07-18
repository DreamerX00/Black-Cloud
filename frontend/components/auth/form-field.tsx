"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function FormField({
  label,
  hint,
  error,
  icon,
  className,
  ...rest
}: {
  label: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-mono-caps text-ink-mute">{label}</span>
      <span className={cn(
        "clay-inset flex items-center gap-3 rounded-xl px-4 py-3 transition-colors focus-within:border-ai/50",
        error && "border-danger/40",
      )}>
        {icon && <span className="text-ink-mute">{icon}</span>}
        <input
          {...rest}
          data-cursor="text"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
        />
      </span>
      {hint && !error && <span className="text-xs text-ink-mute">{hint}</span>}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}
