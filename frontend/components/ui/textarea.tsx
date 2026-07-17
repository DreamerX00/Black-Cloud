import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "clay-inset flex min-h-24 w-full rounded-xl bg-transparent px-4 py-3 text-sm text-foreground transition-[color,box-shadow] outline-none",
        "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-accent-violet/60",
        "disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-destructive/50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
