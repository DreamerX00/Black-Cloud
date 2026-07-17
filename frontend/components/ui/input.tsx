import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "clay-inset flex h-11 w-full min-w-0 rounded-xl bg-transparent px-4 py-2 text-sm text-foreground transition-[color,box-shadow] outline-none",
        "placeholder:text-muted-foreground selection:bg-accent-violet selection:text-white",
        "focus-visible:ring-2 focus-visible:ring-accent-violet/60",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:ring-2 aria-invalid:ring-destructive/50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
