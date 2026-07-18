"use client";

import { Search, Sparkles, Circle } from "lucide-react";
import { usePathname } from "next/navigation";

export function AppTopbar() {
  const pathname = usePathname();

  const label = pathname === "/dashboard" ? "Dashboard"
    : pathname === "/projects" ? "Projects"
    : pathname.startsWith("/projects/new") ? "New project"
    : pathname.startsWith("/projects/") ? "Project"
    : pathname.startsWith("/playground") ? "Cloud Playground"
    : pathname.startsWith("/ai-architect") ? "AI Architect"
    : pathname.startsWith("/simulator") ? "Failure Simulator"
    : pathname.startsWith("/cost") ? "Cost Simulator"
    : pathname.startsWith("/health-score") ? "Health Score"
    : pathname.startsWith("/time-machine") ? "Time Machine"
    : pathname.startsWith("/migration") ? "Migration Ground"
    : pathname.startsWith("/settings") ? "Settings"
    : "Workspace";

  const openCommand = () => window.dispatchEvent(new CustomEvent("blackcloud:open-command"));

  return (
    <header className="sticky top-24 z-30 mb-2 -mt-2 flex items-center justify-between gap-4 border-b border-white/5 bg-void/40 px-4 py-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <span className="font-display text-xl font-semibold">{label}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-success">
          <Circle className="h-2 w-2 fill-success text-success" />
          synced
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={openCommand}
          className="glass hidden items-center gap-3 rounded-full px-4 py-1.5 text-xs text-ink-dim transition-colors hover:text-ink md:inline-flex"
        >
          <Search className="h-3.5 w-3.5" /> Jump anywhere <kbd className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
        </button>
        <button
          data-cursor="grow"
          className="clay inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-ai" /> Ask the Council
        </button>
      </div>
    </header>
  );
}
