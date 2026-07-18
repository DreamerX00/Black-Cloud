"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MARKETING_NAV, CONSOLE_NAV } from "@/lib/nav";
import {
  Search,
  FileText,
  Zap,
  Clock,
  ArrowRight,
  Plus,
  LayoutDashboard,
} from "lucide-react";

// ---------- data ----------

interface PaletteItem {
  id: string;
  label: string;
  href?: string;
  group: "pages" | "actions" | "recent";
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string;
}

// ponytail: flatten nav trees into searchable items at module level
function buildPages(): PaletteItem[] {
  const pages: PaletteItem[] = [];
  for (const item of MARKETING_NAV) {
    if (item.children) {
      for (const child of item.children) {
        pages.push({
          id: child.href,
          label: child.label,
          href: child.href,
          group: "pages",
          icon: FileText,
          keywords: child.description,
        });
      }
    } else {
      pages.push({
        id: item.href,
        label: item.label,
        href: item.href,
        group: "pages",
        icon: FileText,
      });
    }
  }
  for (const item of CONSOLE_NAV) {
    pages.push({
      id: `console-${item.href}`,
      label: item.label,
      href: item.href,
      group: "pages",
      icon: LayoutDashboard,
      keywords: `console app ${item.label}`,
    });
  }
  return pages;
}

const STATIC_PAGES = buildPages();

const ACTIONS: PaletteItem[] = [
  { id: "action-new-project", label: "Create new project", group: "actions", icon: Plus, href: "/playground" },
  { id: "action-ai-design", label: "Start AI Architect session", group: "actions", icon: Zap, href: "/ai-architect" },
  { id: "action-migrate", label: "Begin migration", group: "actions", icon: ArrowRight, href: "/migration" },
];

const ALL_ITEMS: PaletteItem[] = [...STATIC_PAGES, ...ACTIONS];

// ---------- component ----------

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recents, setRecents] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load recents from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bc-cmd-recent");
      if (stored) setRecents(JSON.parse(stored));
    } catch { /* noop */ }
  }, []);

  // Global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Reset state on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // Focus input after dialog animation
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Build filtered + grouped results
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    // Build recent items
    const recentItems: PaletteItem[] = recents
      .map((id) => ALL_ITEMS.find((it) => it.id === id))
      .filter(Boolean)
      .map((it) => ({ ...it!, group: "recent" as const, icon: Clock }));

    if (!q) {
      // Show recents first, then pages, then actions
      return [
        ...recentItems.slice(0, 3),
        ...STATIC_PAGES.slice(0, 5),
        ...ACTIONS,
      ];
    }

    return ALL_ITEMS.filter((item) => {
      const hay = `${item.label} ${item.keywords ?? ""} ${item.href ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, recents]);

  // Clamp active index
  useEffect(() => {
    setActiveIndex(0);
  }, [results.length, query]);

  const select = useCallback(
    (item: PaletteItem) => {
      setOpen(false);
      // Save to recents
      const next = [item.id, ...recents.filter((r) => r !== item.id)].slice(0, 5);
      setRecents(next);
      try { localStorage.setItem("bc-cmd-recent", JSON.stringify(next)); } catch { /* noop */ }
      if (item.href) router.push(item.href);
    },
    [recents, router]
  );

  // Keyboard nav
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        select(results[activeIndex]);
      }
    },
    [results, activeIndex, select]
  );

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Group labels
  const groupLabel = (group: string) => {
    switch (group) {
      case "recent": return "Recent";
      case "pages": return "Pages";
      case "actions": return "Actions";
      default: return group;
    }
  };

  // Build grouped display
  const grouped = useMemo(() => {
    const groups: { key: string; label: string; items: (PaletteItem & { globalIndex: number })[] }[] = [];
    let idx = 0;
    const seen = new Set<string>();

    for (const item of results) {
      if (!seen.has(item.group)) {
        seen.add(item.group);
        groups.push({ key: item.group, label: groupLabel(item.group), items: [] });
      }
      const group = groups.find((g) => g.key === item.group)!;
      group.items.push({ ...item, globalIndex: idx });
      idx++;
    }
    return groups;
  }, [results]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-lg p-0 gap-0 overflow-hidden"
        onKeyDown={onKeyDown}
      >
        <DialogTitle className="sr-only">Command Palette</DialogTitle>

        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-white/5 px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions..."
            className="flex-1 h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-white/10 bg-white/5 px-1.5 text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[320px] overflow-y-auto p-2">
          {grouped.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          )}

          {grouped.map((group) => (
            <div key={group.key} className="mb-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.label}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.globalIndex === activeIndex;
                return (
                  <button
                    key={item.id}
                    data-index={item.globalIndex}
                    onClick={() => select(item)}
                    onMouseEnter={() => setActiveIndex(item.globalIndex)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-colors",
                      isActive
                        ? "bg-white/5 text-foreground shadow-[var(--shadow-clay-sm)]"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.href && (
                      <span className="text-xs text-muted-foreground/60 truncate max-w-[120px]">
                        {item.href}
                      </span>
                    )}
                    {isActive && (
                      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 border-t border-white/5 px-4 py-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="inline-flex h-4 items-center rounded border border-white/10 bg-white/5 px-1">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="inline-flex h-4 items-center rounded border border-white/10 bg-white/5 px-1">↵</kbd>
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="inline-flex h-4 items-center rounded border border-white/10 bg-white/5 px-1">esc</kbd>
            close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
