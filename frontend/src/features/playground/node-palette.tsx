"use client";

import { memo, useMemo, useState } from "react";
import Image from "next/image";
import { Search, ChevronDown, DragHandle } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { ClayDivider, ClayBadge } from "@/components/ui/clay";
import { ProviderMark } from "@/components/icons";
import {
  NODES_BY_PROVIDER,
  PROVIDER_META,
  searchNodes,
  type NodeDefinition,
  type Provider,
} from "@/lib/nodes/registry";
import { cn } from "@/lib/utils";

/**
 * NodePalette — the claymorphic services drawer.
 *
 * Anchored side panel (per DESIGN_SYSTEM: claymorphism for panels). Each
 * palette item is draggable via native HTML5 drag/drop — React Flow reads
 * the `application/bc-node` mimetype on drop.
 *
 * Provider sections collapse; items are grouped and search-filtered.
 * Reveal-drag affordance: the drag-handle icon appears on hover so users
 * discover that these tiles are grabable.
 */
export function NodePalette() {
  const [q, setQ] = useState("");
  const [collapsed, setCollapsed] = useState<Record<Provider, boolean>>({
    aws: false,
    azure: false,
    gcp: false,
  });

  const grouped = useMemo(() => {
    if (!q.trim()) return NODES_BY_PROVIDER;
    const hits = searchNodes(q);
    return {
      aws: hits.filter((n) => n.provider === "aws"),
      azure: hits.filter((n) => n.provider === "azure"),
      gcp: hits.filter((n) => n.provider === "gcp"),
    };
  }, [q]);

  return (
    <aside className="flex h-full w-80 flex-col clay shadow-clay-3 border-r border-white/5 rounded-none bg-[--clay-bg-2]">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-ink-dim">
            Services
          </h2>
          <ClayBadge tone="ai" className="text-[9px]">
            {
              (Object.values(grouped) as NodeDefinition[][]).reduce(
                (acc, arr) => acc + arr.length,
                0,
              )
            }
          </ClayBadge>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-dim" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search services…"
            className="clay-pressed rounded-clay-sm border-white/5 bg-[--clay-bg-3] pl-9"
            aria-label="Search services"
          />
        </div>
      </div>

      <ClayDivider />

      {/* Grouped list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {(Object.keys(grouped) as Provider[]).map((provider) => {
          const items = grouped[provider];
          if (items.length === 0) return null;
          const isCollapsed = collapsed[provider];
          return (
            <section key={provider}>
              <button
                type="button"
                onClick={() =>
                  setCollapsed((c) => ({ ...c, [provider]: !c[provider] }))
                }
                className={cn(
                  "flex w-full items-center gap-2 px-2 py-1.5 rounded-clay-sm",
                  "text-[10px] font-mono uppercase tracking-[0.2em]",
                  "text-ink-dim hover:text-ink hover:bg-white/[0.03] transition-colors",
                )}
              >
                <ProviderMark provider={provider} className="size-3.5" />
                <span>{PROVIDER_META[provider].label}</span>
                <span className="ml-auto text-ink-dim">{items.length}</span>
                <ChevronDown
                  className={cn(
                    "size-3 transition-transform",
                    isCollapsed && "-rotate-90",
                  )}
                />
              </button>
              {!isCollapsed && (
                <ul className="mt-1 space-y-1">
                  {items.map((def) => (
                    <PaletteItem key={def.id} def={def} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <ClayDivider />
      <div className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-ink-dim flex items-center gap-2">
        <DragHandle className="size-3" />
        <span>Drag onto the canvas</span>
      </div>
    </aside>
  );
}

const PaletteItem = memo(function PaletteItem({
  def,
}: {
  def: NodeDefinition;
}) {
  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/bc-node", def.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className={cn(
        "group relative flex cursor-grab items-center gap-3 rounded-clay-sm px-3 py-2 text-sm",
        "clay-hover bg-transparent border border-transparent hover:border-white/5",
        "hover:shadow-clay-1 active:cursor-grabbing active:scale-[0.98]",
        "transition-all duration-200",
      )}
      title={def.fullName}
    >
      {/* Icon — clay chip framing so the SVG glyph has proper depth */}
      <div
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-clay-sm bg-[--clay-bg-3] border border-white/5",
          "shadow-clay-1",
        )}
      >
        {def.iconPath ? (
          <Image
            src={def.iconPath}
            alt=""
            aria-hidden
            width={20}
            height={20}
            unoptimized
          />
        ) : (
          <span
            className="text-[10px] font-semibold text-white leading-none"
            style={{ color: def.accent }}
          >
            {def.label.slice(0, 2)}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="truncate text-ink">{def.label}</div>
        <div className="truncate text-[10px] text-ink-dim font-mono uppercase tracking-wider">
          {def.category}
        </div>
      </div>
      <DragHandle className="size-4 shrink-0 text-ink-dim opacity-0 group-hover:opacity-100 transition-opacity" />
    </li>
  );
});
