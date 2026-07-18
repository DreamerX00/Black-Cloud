"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type ChangelogEntry, type ChangelogType } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectionReveal, RevealItem } from "@/components/layout/section-reveal";
import { ClayPanel } from "@/components/layout/clay-panel";
import { GlowOrb } from "@/components/effects/glow-orb";
import { Mail, Sparkles, Bug, Wrench, ChevronRight, Check } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TYPE_META: Record<ChangelogType, { label: string; color: string; border: string; icon: typeof Sparkles }> = {
  feature:     { label: "Feature",     color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", border: "border-l-emerald-500", icon: Sparkles },
  fix:         { label: "Bug Fix",     color: "bg-sky-500/15 text-sky-400 border-sky-500/30",             border: "border-l-sky-500",     icon: Bug },
  improvement: { label: "Improvement", color: "bg-violet-500/15 text-violet-400 border-violet-500/30",    border: "border-l-violet-500",  icon: Wrench },
};

/* ------------------------------------------------------------------ */
/*  Subscribe Banner                                                   */
/* ------------------------------------------------------------------ */

export function SubscribeBanner() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <SectionReveal className="mx-auto max-w-3xl px-4 pt-8">
      <ClayPanel hoverable glowColor="#8B5CF6" className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:gap-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Mail className="h-5 w-5 text-violet-400" />
          <span className="text-sm font-medium text-primary">Subscribe to product updates</span>
        </div>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-sm text-emerald-400"
          >
            <Check className="h-4 w-4" /> Subscribed!
          </motion.div>
        ) : (
          <form
            className="flex w-full flex-1 gap-2 sm:w-auto"
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          >
            <Input
              type="email"
              required
              placeholder="you@company.com"
              className="h-9 flex-1 border-white/10 bg-white/5 text-sm placeholder:text-muted-foreground"
            />
            <Button type="submit" size="sm" className="shrink-0">
              Subscribe
            </Button>
          </form>
        )}
      </ClayPanel>
    </SectionReveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Single changelog card                                              */
/* ------------------------------------------------------------------ */

function ChangelogCard({ entry }: { entry: ChangelogEntry }) {
  const meta = TYPE_META[entry.type];
  const Icon = meta.icon;

  // ponytail: color map for ClayPanel glow per type
  const glowMap: Record<ChangelogType, string> = { feature: "#22C55E", fix: "#0EA5E9", improvement: "#8B5CF6" };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35 }}
    >
      <ClayPanel hoverable glowColor={glowMap[entry.type]} className={`relative border-l-4 ${meta.border} p-6 md:p-8`}>
      {/* header */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Badge variant="outline" className={meta.color}>
          <Icon className="mr-1.5 h-3 w-3" />
          {meta.label}
        </Badge>
        <Badge variant="outline" className="border-white/10 bg-white/5 font-mono text-xs text-primary">
          v{entry.version}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {new Date(entry.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      {/* title + description */}
      <h3 className="font-display text-xl font-semibold text-primary">{entry.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{entry.description}</p>

      {/* changes list */}
      <ul className="mt-4 space-y-2">
        {entry.changes.map((c, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-primary/80">
            <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
            {c}
          </li>
        ))}
      </ul>
      </ClayPanel>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline with filter tabs                                          */
/* ------------------------------------------------------------------ */

export function ChangelogTimeline({ entries }: { entries: ChangelogEntry[] }) {
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? entries : entries.filter((e) => e.type === tab);

  return (
    <section className="relative mx-auto max-w-3xl px-4 py-12 md:py-20">
      {/* ambient glow */}
      <GlowOrb color="rgba(139,92,246,0.1)" size={400} className="absolute -left-20 top-40" />
      <GlowOrb color="rgba(6,182,212,0.07)" size={350} className="absolute -right-20 top-[60%]" />
      {/* filter tabs */}
      <SectionReveal>
        <Tabs value={tab} onValueChange={setTab} className="mb-10">
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-4 bg-white/5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="feature">Features</TabsTrigger>
            <TabsTrigger value="fix">Fixes</TabsTrigger>
            <TabsTrigger value="improvement">Improvements</TabsTrigger>
          </TabsList>
        </Tabs>
      </SectionReveal>

      {/* timeline */}
      <div className="relative space-y-6">
        {/* vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-violet-500/40 via-violet-500/10 to-transparent md:block" />

        <AnimatePresence mode="popLayout">
          {filtered.map((entry, i) => (
            <div key={entry.version} className="relative md:pl-8">
              {/* timeline dot */}
              <div className="absolute left-0 top-8 hidden h-3.5 w-3.5 rounded-full border-2 border-violet-500 bg-void md:block" />
              <RevealItem delay={i * 0.06}>
                <ChangelogCard entry={entry} />
              </RevealItem>
            </div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center text-muted-foreground"
          >
            No entries in this category yet.
          </motion.p>
        )}
      </div>
    </section>
  );
}
