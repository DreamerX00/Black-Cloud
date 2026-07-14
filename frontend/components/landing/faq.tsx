"use client";

import { motion } from "motion/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const EASE = [0.16, 1, 0.3, 1] as const;

const FAQS: { q: string; a: string }[] = [
  {
    q: "Which clouds are supported?",
    a: "AWS, Azure, and GCP, with 23 services today across compute, containers, serverless, networking, database, storage, CDN, and DNS.",
  },
  {
    q: "How does live validation work?",
    a: "As you connect nodes, each edge is checked against architecture rules and colored instantly. Invalid edges, like a load balancer wired straight to a database, are flagged with a concrete fix.",
  },
  {
    q: "Can I export my design?",
    a: "Yes — the entire architecture exports to clean JSON in one click.",
  },
  {
    q: "Do I need an account?",
    a: "You can open the playground instantly. Sign in to save and revisit projects.",
  },
  {
    q: "Is it accessible?",
    a: "Yes — it honors prefers-reduced-motion, keeps visible focus rings, and is keyboard navigable.",
  },
  {
    q: "Is it free?",
    a: "The playground is free to start.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          Questions
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
          Frequently asked.
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        className="mt-14"
      >
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map(({ q, a }) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-left font-display text-base sm:text-lg">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-fg-muted">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
