"use client";

import { motion } from "motion/react";
import ScrollVelocity from "@/components/reactbits/ScrollVelocity";

// Edge fade so the marquee dissolves into the section borders.
const EDGE_FADE =
  "linear-gradient(to right, transparent, black 12%, black 88%, transparent)";

export function ProviderMarquee() {
  return (
    <section className="relative overflow-hidden border-y border-border py-16">
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 text-center font-mono text-xs uppercase tracking-[0.3em] text-primary"
      >
        Works across every major cloud
      </motion.p>

      <div style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}>
        <ScrollVelocity
          texts={["AWS · Azure · GCP · ", "VPC · EC2 · Lambda · S3 · RDS · Cloud Run · AKS · "]}
          velocity={50}
          className="font-display text-5xl font-bold text-fg/10 sm:text-7xl"
        />
      </div>
    </section>
  );
}
