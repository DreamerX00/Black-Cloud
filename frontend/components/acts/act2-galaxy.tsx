"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Boxes,
  Cloud,
  Container,
  Database,
  HardDrive,
  Layers,
  Network,
  Radio,
  Server,
  Zap,
} from "lucide-react";
import { CATALOG, PROVIDER_META, type Provider } from "@/lib/catalog/nodes";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TiltCard } from "@/components/effects/tilt-card";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { BeamBorder } from "@/components/effects/beam-border";
import { GridPattern } from "@/components/effects/grid-pattern";
import { TextReveal } from "@/components/effects/text-reveal";
import { cn } from "@/lib/utils";

type Filter = "all" | Provider;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "aws", label: "AWS" },
  { value: "azure", label: "Azure" },
  { value: "gcp", label: "Google Cloud" },
];

const BRAND: Record<Provider, string> = {
  aws: "#ff9900",
  azure: "#0078d4",
  gcp: "#4285f4",
};

// ponytail: keyword→icon lookup; falls back to Cloud. Cheaper than an icon field on 23 rows.
function iconFor(id: string, name: string) {
  const k = `${id} ${name}`.toLowerCase();
  if (/comput|vm|ec2|engine/.test(k)) return Server;
  if (/storage|blob|s3|bucket/.test(k)) return HardDrive;
  if (/function|lambda/.test(k)) return Zap;
  if (/sql|rds|spanner|cosmos|nosql|dynamo|bigquery/.test(k)) return Database;
  if (/kubernetes|eks|aks|gke/.test(k)) return Boxes;
  if (/container|run|aci/.test(k)) return Container;
  if (/queue|bus|pub|messag/.test(k)) return Radio;
  if (/cdn|delivery/.test(k)) return Network;
  if (/nosql/.test(k)) return Layers;
  return Cloud;
}

// First service of each provider gets a featured (larger + beam) cell for bento rhythm.
const FEATURED = new Set(["ec2", "vm", "gce"]);

export default function Act2Galaxy() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all" ? CATALOG : CATALOG.filter((s) => s.provider === filter);

  return (
    <section className="relative min-h-[150vh] px-6 py-32">
      <GridPattern className="opacity-20" />

      <div className="mx-auto max-w-6xl">
        <TextReveal className="mb-4 text-center">
          <h2 className="text-4xl font-bold sm:text-5xl">
            23 services. <span className="text-accent-violet">One surface.</span>
          </h2>
        </TextReveal>
        <TextReveal className="mb-12 text-center">
          <p className="mx-auto max-w-xl text-balance text-zinc-400">
            Every major primitive across AWS, Azure, and Google Cloud —
            provisioned, wired, and observable from a single control plane.
          </p>
        </TextReveal>

        <div className="mb-12 flex justify-center">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList className="border border-white/10 bg-white/5 backdrop-blur-sm">
              {FILTERS.map((f) => (
                <TabsTrigger key={f.value} value={f.value} className="px-4">
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((s, i) => {
              const featured = FEATURED.has(s.id);
              const Icon = iconFor(s.id, s.name);
              const brand = BRAND[s.provider];

              const inner = (
                <SpotlightCard className="flex h-full flex-col justify-between border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
                  <div className="flex items-start justify-between">
                    <span
                      className="font-mono text-xs uppercase tracking-wider"
                      style={{ color: brand }}
                    >
                      {PROVIDER_META[s.provider].label}
                    </span>
                    <Icon
                      className="size-5 opacity-60"
                      style={{ color: brand }}
                      aria-hidden
                    />
                  </div>
                  <div>
                    <h3
                      className={cn(
                        "font-semibold text-white",
                        featured ? "text-2xl" : "text-lg",
                      )}
                    >
                      {s.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">{s.blurb}</p>
                  </div>
                </SpotlightCard>
              );

              return (
                <motion.div
                  key={s.id}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={
                    reduced ? undefined : { opacity: 1, scale: 1, y: 0 }
                  }
                  animate={reduced ? { opacity: 1 } : undefined}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{
                    duration: 0.4,
                    delay: reduced ? 0 : (i % 8) * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cn(
                    featured && "col-span-2 row-span-2",
                    "min-w-0",
                  )}
                >
                  <TiltCard className="h-full">
                    {featured ? (
                      <BeamBorder className="h-full">{inner}</BeamBorder>
                    ) : (
                      inner
                    )}
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
