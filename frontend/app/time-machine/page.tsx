"use client";

// Time Machine — snapshot timeline scrubber. Pick two snapshots on a draggable
// timeline; a visual diff shows added (green) / removed (red) / unchanged nodes.
// A play control walks the "current" head forward through snapshots.
// ponytail: Snapshot in mock has only a `nodes` count, so node sets are derived
// deterministically from the first N CATALOG ids — real diffs, no new mock data.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Play, Pause, RotateCcw, Plus, Minus, Equal, GitCompare } from "lucide-react";
import { AppFrame } from "@/components/layout/app-frame";
import { ClayPanel } from "@/components/layout/clay-panel";
import { SNAPSHOTS, type Snapshot } from "@/lib/mock";
import { CATALOG } from "@/lib/catalog/nodes";
import { ServiceIcon, PROVIDER_COLOR } from "@/lib/brand-icons";
import { cn } from "@/lib/utils";

const nodesFor = (snap: Snapshot) => CATALOG.slice(0, snap.nodes);

type DiffKind = "added" | "removed" | "same";
interface DiffRow {
  service: (typeof CATALOG)[number];
  kind: DiffKind;
}

function diffSnapshots(a: Snapshot, b: Snapshot): DiffRow[] {
  const setA = new Set(nodesFor(a).map((s) => s.id));
  const setB = new Set(nodesFor(b).map((s) => s.id));
  const seen = new Set<string>();
  const rows: DiffRow[] = [];
  for (const s of [...nodesFor(a), ...nodesFor(b)]) {
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    const inA = setA.has(s.id);
    const inB = setB.has(s.id);
    rows.push({ service: s, kind: inA && inB ? "same" : inB ? "added" : "removed" });
  }
  // added → removed → same, then by name for a stable, readable order.
  const order: Record<DiffKind, number> = { added: 0, removed: 1, same: 2 };
  return rows.sort((x, y) => order[x.kind] - order[y.kind] || x.service.name.localeCompare(y.service.name));
}

const KIND_META: Record<DiffKind, { label: string; icon: typeof Plus; cls: string; ring: string }> = {
  added: { label: "Added", icon: Plus, cls: "text-status-success", ring: "ring-status-success/40 bg-status-success/10" },
  removed: { label: "Removed", icon: Minus, cls: "text-status-danger", ring: "ring-status-danger/40 bg-status-danger/10" },
  same: { label: "Unchanged", icon: Equal, cls: "text-muted-foreground", ring: "ring-border/60 bg-muted/20" },
};

export default function TimeMachinePage() {
  const reduce = useReducedMotion();
  // Two selected indices: `from` (left) and `to` (right). to = playback head.
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(SNAPSHOTS.length - 1);
  const [playing, setPlaying] = useState(false);

  const timelineRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => diffSnapshots(SNAPSHOTS[from], SNAPSHOTS[to]), [from, to]);
  const counts = useMemo(() => {
    const c = { added: 0, removed: 0, same: 0 };
    for (const r of rows) c[r.kind]++;
    return c;
  }, [rows]);

  // Playback: advance `to` head through snapshots, then stop at the end.
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setTo((prev) => {
        if (prev >= SNAPSHOTS.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1400);
    return () => clearInterval(t);
  }, [playing]);

  const play = useCallback(() => {
    if (to >= SNAPSHOTS.length - 1) setTo(from + 1 <= SNAPSHOTS.length - 1 ? from + 1 : from);
    setPlaying((p) => !p);
  }, [to, from]);

  const rewind = useCallback(() => {
    setPlaying(false);
    setFrom(0);
    setTo(SNAPSHOTS.length - 1);
  }, []);

  // Click a point → set as the `to` head, keeping from < to.
  const selectPoint = useCallback((i: number) => {
    setPlaying(false);
    setTo(i);
    setFrom((f) => (i <= f ? Math.max(0, i - 1) : f));
  }, []);

  const snapFrom = SNAPSHOTS[from];
  const snapTo = SNAPSHOTS[to];
  const lo = Math.min(from, to);
  const hi = Math.max(from, to);

  return (
    <AppFrame title="Time Machine">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Timeline scrubber */}
        <ClayPanel className="p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Snapshot timeline</h2>
              <p className="text-sm text-muted-foreground">
                Pick two points to compare — {snapFrom.label} → {snapTo.label}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <PlayButton playing={playing} onClick={play} />
              <button
                type="button"
                onClick={rewind}
                aria-label="Rewind to full history"
                className="clay-pressable flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-4" />
              </button>
            </div>
          </div>

          <div ref={timelineRef} className="relative px-2 py-8">
            {/* base rail */}
            <div className="clay-inset absolute inset-x-2 top-1/2 h-2 -translate-y-1/2 rounded-full" />
            {/* selected range fill */}
            <motion.div
              className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan"
              style={{
                left: `calc(${(lo / (SNAPSHOTS.length - 1)) * 100}% )`,
                right: `calc(${(1 - hi / (SNAPSHOTS.length - 1)) * 100}%)`,
              }}
              layout
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
            />
            <div className="relative flex items-center justify-between">
              {SNAPSHOTS.map((snap, i) => {
                const active = i === from || i === to;
                const inRange = i >= lo && i <= hi;
                return (
                  <button
                    key={snap.id}
                    type="button"
                    onClick={() => selectPoint(i)}
                    aria-label={`Snapshot ${snap.label}, ${snap.date}, ${snap.nodes} nodes`}
                    aria-pressed={active}
                    className="group relative flex flex-col items-center focus-visible:outline-none"
                  >
                    <motion.span
                      whileHover={reduce ? undefined : { scale: 1.18 }}
                      whileTap={reduce ? undefined : { scale: 0.92 }}
                      className={cn(
                        "z-10 flex size-6 items-center justify-center rounded-full ring-2 transition-colors",
                        active
                          ? "bg-accent-cyan ring-accent-cyan/50 shadow-[0_0_18px_rgba(34,211,238,0.6)]"
                          : inRange
                            ? "bg-accent-violet/70 ring-accent-violet/40"
                            : "clay ring-border/60 group-hover:ring-accent-cyan/50",
                      )}
                    >
                      {i === from && <span className="size-2 rounded-full bg-background" />}
                    </motion.span>
                    <span
                      className={cn(
                        "mt-3 text-xs font-medium transition-colors",
                        active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {snap.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground/70">{snap.date}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </ClayPanel>

        {/* Snapshot cards + diff */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-4">
            <SnapshotCard snap={snapFrom} tone="from" />
            <SnapshotCard snap={snapTo} tone="to" />
          </div>

          <ClayPanel className="p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <GitCompare className="size-4 text-accent-cyan" />
                <h2 className="font-display text-lg font-semibold text-foreground">Diff</h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <Legend kind="added" n={counts.added} />
                <Legend kind="removed" n={counts.removed} />
                <Legend kind="same" n={counts.same} />
              </div>
            </div>

            <ul className="grid gap-2 sm:grid-cols-2">
              <AnimatePresence initial={false}>
                {rows.map((row) => {
                  const meta = KIND_META[row.kind];
                  const Icon = meta.icon;
                  return (
                    <motion.li
                      key={row.service.id}
                      layout={!reduce}
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                      transition={{ duration: reduce ? 0 : 0.25 }}
                      className={cn(
                        "clay flex items-center gap-3 rounded-2xl px-3 py-2.5 ring-1",
                        meta.ring,
                        row.kind === "removed" && "opacity-80",
                      )}
                    >
                      <ServiceIcon provider={row.service.provider} id={row.service.id} name={row.service.name} size={26} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{row.service.name}</p>
                        <p
                          className="truncate text-[11px] font-medium"
                          style={{ color: PROVIDER_COLOR[row.service.provider] }}
                        >
                          {row.service.provider.toUpperCase()}
                        </p>
                      </div>
                      <span
                        className={cn("flex items-center gap-1 text-[11px] font-semibold", meta.cls)}
                        aria-label={meta.label}
                      >
                        <Icon className="size-3.5" />
                      </span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </ClayPanel>
        </div>
      </div>
    </AppFrame>
  );
}

function PlayButton({ playing, onClick }: { playing: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={playing ? "Pause playback" : "Play through snapshots"}
      className="clay-pressable flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-accent-violet to-accent-cyan px-4 text-sm font-semibold text-background"
    >
      {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      {playing ? "Pause" : "Play"}
    </button>
  );
}

function Legend({ kind, n }: { kind: DiffKind; n: number }) {
  const meta = KIND_META[kind];
  return (
    <span className={cn("clay-inset flex items-center gap-1.5 rounded-full px-2.5 py-1", meta.cls)}>
      <span className="size-1.5 rounded-full bg-current" />
      {n} {meta.label}
    </span>
  );
}

function SnapshotCard({ snap, tone }: { snap: Snapshot; tone: "from" | "to" }) {
  return (
    <ClayPanel className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className={cn(
              "clay-inset rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              tone === "from" ? "text-accent-violet" : "text-accent-cyan",
            )}
          >
            {tone === "from" ? "From" : "To"}
          </span>
          <h3 className="mt-2 font-display text-xl font-semibold text-foreground">{snap.label}</h3>
          <p className="text-xs text-muted-foreground">{snap.date}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold text-gradient">{snap.nodes}</p>
          <p className="text-[11px] text-muted-foreground">nodes</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{snap.note}</p>
    </ClayPanel>
  );
}
