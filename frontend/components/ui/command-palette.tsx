"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Search,
  Boxes,
  Sparkles,
  ArrowLeftRight,
  ShieldAlert,
  Clock3,
  Coins,
  BrainCircuit,
  LayoutDashboard,
  Settings,
  User,
  BookOpen,
  Radio,
  Command,
  ArrowRight,
  Sun,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/cn";

type Item = {
  id: string;
  label: string;
  hint?: string;
  keywords: string[];
  href?: string;
  action?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  section: "Navigate" | "Product" | "Account" | "Actions";
};

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const items: Item[] = useMemo(
    () => [
      { id: "dash", label: "Dashboard", section: "Navigate", href: "/dashboard", icon: LayoutDashboard, keywords: ["home", "hub"] },
      { id: "projects", label: "Projects", section: "Navigate", href: "/projects", icon: Boxes, keywords: ["work"] },
      { id: "docs", label: "Docs", section: "Navigate", href: "/docs", icon: BookOpen, keywords: ["help"] },
      { id: "blog", label: "Field Notes", section: "Navigate", href: "/blog", icon: BookOpen, keywords: ["blog", "writing"] },
      { id: "changelog", label: "Changelog", section: "Navigate", href: "/changelog", icon: Radio, keywords: ["releases"] },

      { id: "playground", label: "Cloud Playground", section: "Product", href: "/product/cloud-playground", icon: Boxes, keywords: ["canvas", "design"] },
      { id: "ai", label: "AI Architect", section: "Product", href: "/product/ai-architect", icon: Sparkles, keywords: ["generate", "prompt"] },
      { id: "migration", label: "Migration Ground", section: "Product", href: "/product/migration-ground", icon: ArrowLeftRight, keywords: ["port"] },
      { id: "failure", label: "Failure Simulator", section: "Product", href: "/product/failure-simulator", icon: ShieldAlert, keywords: ["chaos"] },
      { id: "time", label: "Time Machine", section: "Product", href: "/product/time-machine", icon: Clock3, keywords: ["history"] },
      { id: "cost", label: "Cost Simulator", section: "Product", href: "/product/cost-simulator", icon: Coins, keywords: ["billing"] },
      { id: "arch", label: "Architecture Intelligence", section: "Product", href: "/product/architecture-intelligence", icon: BrainCircuit, keywords: ["score"] },

      { id: "settings", label: "Settings", section: "Account", href: "/settings", icon: Settings, keywords: [] },
      { id: "profile", label: "Profile", section: "Account", href: "/settings/profile", icon: User, keywords: [] },
      { id: "billing", label: "Billing", section: "Account", href: "/settings/billing", icon: Coins, keywords: ["invoice"] },

      { id: "theme", label: "Toggle low-motion mode", section: "Actions", icon: Sun, keywords: ["reduce"], action: () => { document.documentElement.classList.toggle("motion-low"); }},
      { id: "notify", label: "Ping the council", section: "Actions", icon: Bell, keywords: ["notify"], action: () => window.dispatchEvent(new CustomEvent("blackcloud:council")) },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(it =>
      [it.label, it.section, ...(it.keywords ?? [])].some(k => k.toLowerCase().includes(q))
    );
  }, [items, query]);

  const wasOpenRef = useRef(false);
  if (open && !wasOpenRef.current) {
    wasOpenRef.current = true;
    if (query) setQuery("");
    if (selected !== 0) setSelected(0);
  } else if (!open && wasOpenRef.current) {
    wasOpenRef.current = false;
  }

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter") {
        e.preventDefault();
        const target = filtered[selected];
        if (!target) return;
        if (target.href) { router.push(target.href); onOpenChange(false); }
        else { target.action?.(); onOpenChange(false); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, selected, router, onOpenChange]);

  const grouped = useMemo(() => {
    const g: Record<string, Item[]> = {};
    filtered.forEach(it => { (g[it.section] ??= []).push(it); });
    return g;
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-[10vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className="absolute inset-0 bg-void/70 backdrop-blur-xl"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          />
          <motion.div
            role="dialog"
            aria-label="Command palette"
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="clay-lg relative z-10 w-full max-w-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
              <Search className="h-4 w-4 text-ink-mute" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0); }}
                placeholder="Search everywhere — projects, docs, actions…"
                className="w-full bg-transparent text-base text-ink placeholder:text-ink-faint outline-none"
              />
              <kbd className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-ink-mute">ESC</kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {Object.entries(grouped).map(([section, list]) => (
                <div key={section} className="mb-2">
                  <div className="px-3 pb-1 pt-2 text-mono-caps text-ink-mute">{section}</div>
                  {list.map(it => {
                    const idx = filtered.indexOf(it);
                    const Icon = it.icon;
                    const active = idx === selected;
                    return (
                      <button
                        key={it.id}
                        onMouseEnter={() => setSelected(idx)}
                        onClick={() => {
                          if (it.href) { router.push(it.href); onOpenChange(false); }
                          else { it.action?.(); onOpenChange(false); }
                        }}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                          active ? "bg-white/5 text-ink" : "text-ink-dim hover:bg-white/5"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", active ? "text-ai" : "text-ink-mute")} />
                        <span className="flex-1">{it.label}</span>
                        {active && <ArrowRight className="h-3.5 w-3.5 text-ai" />}
                      </button>
                    );
                  })}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-6 py-14 text-center text-sm text-ink-mute">
                  Nothing matches. Try <span className="text-ink">migration</span> or <span className="text-ink">council</span>.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/8 px-5 py-3 text-[11px] text-ink-mute">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1"><kbd className="rounded bg-white/5 px-1 font-mono">↑↓</kbd> navigate</span>
                <span className="inline-flex items-center gap-1"><kbd className="rounded bg-white/5 px-1 font-mono">↵</kbd> select</span>
                <span className="inline-flex items-center gap-1"><kbd className="rounded bg-white/5 px-1 font-mono">esc</kbd> dismiss</span>
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono">
                <Command className="h-3 w-3" /> palette · v0.1.0
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
