"use client";

// Bento feature grid for the BlackCloud homepage.
import { motion } from "motion/react";
import {
  ShieldCheck,
  Layers,
  Download,
  Workflow,
  Accessibility,
  type LucideIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  className: string;
};

const FEATURES: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Live validation",
    description:
      "Catches invalid edges the moment you draw them. Wire an ALB straight to an RDS and it's flagged instantly, with the fix: insert a compute tier — LB → ECS → DB.",
    className: "md:col-span-2",
  },
  {
    icon: Layers,
    title: "Multi-cloud canvas",
    description: "23 services across AWS, Azure, and GCP on one infinite surface.",
    className: "md:row-span-2",
  },
  {
    icon: Download,
    title: "One-click export",
    description: "Ship your whole architecture to JSON in a single click.",
    className: "",
  },
  {
    icon: Workflow,
    title: "Real-time edges",
    description: "Data-flow arrows colored live by validity as connections form.",
    className: "",
  },
  {
    icon: Accessibility,
    title: "Reduced-motion & a11y",
    description:
      "Honors prefers-reduced-motion, with full keyboard navigation and visible focus rings.",
    className: "md:col-span-2",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function BentoFeatures() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease }}
        className="mb-14 max-w-2xl"
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          Everything on one canvas
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
          Build. Validate. Export.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description, className }, i) => (
          <motion.div
            key={title}
            className={className}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardHeader>
                <div
                  className={cn(
                    "mb-3 flex size-11 items-center justify-center rounded-xl",
                    "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
