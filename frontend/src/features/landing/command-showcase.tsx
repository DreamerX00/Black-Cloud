"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { NODE_REGISTRY } from "@/lib/nodes/registry";
import { Reveal } from "@/components/motion/reveal";

/**
 * Command palette showcase — Act V.
 *
 * A stylised replay of the ⌘K experience. It types one query at a time,
 * filters the node registry live, then wipes and starts a new query. This
 * is the same shape as the real palette (cmdk), only scripted.
 *
 * Rationale: showing the palette in motion is far more persuasive than
 * describing it. Users see it search 23 real services, animated.
 */

const QUERIES = [
  "postgres",
  "serverless",
  "load bal",
  "cdn",
  "kubernetes",
];

const TYPE_MS = 90;
const HOLD_MS = 1400;
const WIPE_MS = 500;

export function CommandShowcase() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();

  const [qIndex, setQIndex] = useState(0);
  // Seed with the first query when RM is on so the results panel renders a
  // populated list at rest. When motion is allowed, start empty so the
  // typing animation reads from a clean input.
  const [typed, setTyped] = useState(() => (reduce ? QUERIES[0] : ""));

  // Type one query, hold, wipe, next. Cancels cleanly on unmount / out-of-view.
  useEffect(() => {
    if (!inView || reduce) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const runOne = (idx: number) => {
      if (cancelled) return;
      const target = QUERIES[idx];
      let i = 0;

      const type = () => {
        if (cancelled) return;
        i += 1;
        setTyped(target.slice(0, i));
        if (i < target.length) {
          timer = setTimeout(type, TYPE_MS);
        } else {
          timer = setTimeout(() => {
            if (cancelled) return;
            // Wipe
            let j = target.length;
            const wipe = () => {
              if (cancelled) return;
              j -= 1;
              setTyped(target.slice(0, Math.max(0, j)));
              if (j > 0) {
                timer = setTimeout(wipe, WIPE_MS / target.length);
              } else {
                const next = (idx + 1) % QUERIES.length;
                setQIndex(next);
                timer = setTimeout(() => runOne(next), 250);
              }
            };
            wipe();
          }, HOLD_MS);
        }
      };
      type();
    };

    runOne(qIndex);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // Only re-run when inView flips — internal state drives the rest.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  const results = useMemo(() => {
    const q = typed.trim().toLowerCase();
    if (!q) return NODE_REGISTRY.slice(0, 5);
    return NODE_REGISTRY.filter((n) => {
      const hay = [n.label, n.fullName, ...n.searchTags, n.category, n.provider]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    }).slice(0, 5);
  }, [typed]);

  return (
    <section ref={ref} className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32">
      <div className="grid gap-12 tablet:grid-cols-[1fr_1.1fr] tablet:gap-16">
        <div className="flex flex-col justify-center">
          <Reveal>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Act V · Search
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
              Type <kbd className="mx-2 inline-flex h-10 items-center rounded-lg border border-border/60 bg-graphite/60 px-2 align-middle font-mono text-base">⌘K</kbd> — the whole cloud, one query away.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              The palette searches every service across AWS, Azure, and GCP.
              Fuzzy match on labels, tags, and capabilities. Drop into your
              canvas with return.
            </p>
          </Reveal>
        </div>

        {/* The palette mock */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_70%)] blur-3xl" />

          <div className="overflow-hidden rounded-2xl border border-border/60 bg-space/70 shadow-[0_40px_120px_-30px_rgba(139,92,246,0.35)] backdrop-blur-xl">
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-border/40 px-5 py-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="flex-1 font-mono text-sm">
                <span className="text-ink">{typed}</span>
                <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-ink align-middle motion-reduce:animate-none" />
              </div>
              <kbd className="rounded-md border border-border/50 bg-graphite/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                esc
              </kbd>
            </div>

            {/* Results */}
            <ul className="max-h-[360px] divide-y divide-border/30">
              {results.length === 0 && (
                <li className="px-5 py-6 text-sm text-muted-foreground">No matches. Try another search.</li>
              )}
              {results.map((n, i) => (
                <motion.li
                  key={`${typed}-${n.id}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.4 + i * 0.03 }}
                  className={`flex items-center gap-3 px-5 py-3 ${i === 0 ? "bg-graphite/50" : ""}`}
                >
                  {n.iconPath ? (
                    <Image
                      src={n.iconPath}
                      width={22}
                      height={22}
                      alt=""
                      aria-hidden
                      unoptimized
                      className="shrink-0"
                    />
                  ) : (
                    <div
                      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded text-[9px] font-medium"
                      style={{ backgroundColor: `${n.accent}22`, color: n.accent }}
                    >
                      {n.label.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{n.fullName}</div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {n.category} · <span style={{ color: n.accent }}>{n.provider.toUpperCase()}</span>
                    </div>
                  </div>
                  {i === 0 && (
                    <kbd className="hidden shrink-0 rounded-md border border-border/50 bg-void/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground tablet:inline-flex">
                      ↵
                    </kbd>
                  )}
                </motion.li>
              ))}
            </ul>

            {/* Footer bar */}
            <div className="flex items-center gap-4 border-t border-border/40 bg-void/40 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>↑↓ navigate</span>
              <span>↵ insert</span>
              <span className="ml-auto">{results.length} of {NODE_REGISTRY.length}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
