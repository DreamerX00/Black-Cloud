"use client";

import { memo, useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  NODES_BY_PROVIDER,
  PROVIDER_META,
  searchNodes,
  type NodeDefinition,
  type Provider,
} from "@/lib/nodes/registry";

/**
 * Draggable service palette.
 * ponytail: Native HTML5 drag/drop — no react-dnd. React Flow reads
 * `dataTransfer` on drop, so this is the shortest integration.
 * With 23 items we skip virtualization; revisit when the catalog grows.
 */
export function NodePalette() {
  const [q, setQ] = useState("");

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
    <aside className="flex h-full w-72 flex-col border-r border-border/60 bg-space/60 backdrop-blur">
      <div className="border-b border-border/60 p-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Services
        </h2>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="pl-8"
            aria-label="Search services"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {(Object.keys(grouped) as Provider[]).map((provider) => {
          const items = grouped[provider];
          if (items.length === 0) return null;
          return (
            <section key={provider} className="mb-4">
              <div className="mb-1 flex items-center gap-2 px-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PROVIDER_META[provider].accent }}
                />
                {PROVIDER_META[provider].label}
                <span className="ml-auto text-muted-foreground/60">
                  {items.length}
                </span>
              </div>
              <ul className="space-y-1">
                {items.map((def) => (
                  <PaletteItem key={def.id} def={def} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="border-t border-border/60 px-3 py-2 text-[10px] text-muted-foreground">
        Drag onto the canvas
      </div>
    </aside>
  );
}

const PaletteItem = memo(function PaletteItem({ def }: { def: NodeDefinition }) {
  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/bc-node", def.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="flex cursor-grab items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-sm transition-colors hover:border-border/60 hover:bg-graphite/60 active:cursor-grabbing"
      title={def.fullName}
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
        <div
          className="grid h-5 w-5 place-items-center rounded text-[9px] font-semibold text-white"
          style={{ backgroundColor: def.accent }}
        >
          {def.label[0]}
        </div>
      )}
      <span className="truncate">{def.label}</span>
    </li>
  );
});
