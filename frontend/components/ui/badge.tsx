import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-accent-violet/40 bg-accent-violet/10 text-accent-violet",
        cyan: "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan",
        success: "border-status-success/40 bg-status-success/10 text-status-success",
        warning: "border-status-warning/40 bg-status-warning/10 text-status-warning",
        danger: "border-status-danger/40 bg-status-danger/10 text-status-danger",
        outline: "border-border text-muted-foreground",
        aws: "border-provider-aws/40 bg-provider-aws/10 text-provider-aws",
        azure: "border-provider-azure/40 bg-provider-azure/10 text-provider-azure",
        gcp: "border-provider-gcp/40 bg-provider-gcp/10 text-provider-gcp",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";
  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
