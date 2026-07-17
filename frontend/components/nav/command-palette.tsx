"use client";

// ⌘K global navigator. Built on Radix Dialog + a filtered list (no cmdk dep).
// Opens on ⌘K / Ctrl+K; type to filter routes; Enter/click to navigate.
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PRODUCT_NAV, MARKETING_NAV, CONSOLE_NAV, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";

const GROUPS: { label: string; items: NavItem[] }[] = [
  { label: "Console", items: CONSOLE_NAV },
  { label: "Product", items: PRODUCT_NAV },
  { label: "Company", items: MARKETING_NAV },
];

const ALL = GROUPS.flatMap((g) => g.items);

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL;
    return ALL.filter(
      (i) => i.label.toLowerCase().includes(q) || i.desc?.toLowerCase().includes(q),
    );
  }, [query]);

  // Keep the active index in range without an effect (avoids cascading renders):
  // clamp at render time. Reset-to-top on new query happens in onChange below.
  const activeIndex = active >= results.length ? 0 : active;

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showClose={false} className="max-w-xl gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive(Math.min(activeIndex + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive(Math.max(activeIndex - 1, 0));
              } else if (e.key === "Enter" && results[activeIndex]) {
                go(results[activeIndex].href);
              }
            }}
            placeholder="Jump to…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">No results.</p>
          )}
          {results.map((item) => {
            const idx = results.indexOf(item);
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onMouseEnter={() => setActive(idx)}
                onClick={() => go(item.href)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  idx === activeIndex ? "bg-accent-violet/15 text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4 shrink-0 text-accent-cyan" />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-foreground">{item.label}</span>
                  {item.desc && <span className="block text-xs text-muted-foreground">{item.desc}</span>}
                </span>
                {idx === activeIndex && <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
