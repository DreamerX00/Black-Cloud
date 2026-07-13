"use client";

import { memo } from "react";
import Image from "next/image";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { NODE_BY_ID, type NodeDefinition } from "@/lib/nodes/registry";
import { cn } from "@/lib/utils";

/**
 * Custom canvas node component.
 *
 * Perf discipline:
 *   - `memo` with default shallow-compare: React Flow re-renders nodes
 *     individually only when their `data`/`selected` changes.
 *   - Registry lookup is O(1) via NODE_BY_ID (Map).
 *   - Icon rendered via next/image — self-host + auto WebP + lazy load.
 *     Falls back to initials chip when a provider has no icon (Azure).
 */
type NodeData = { registryId: string; label: string; notes?: string };

function CloudNodeInner({ data, selected }: NodeProps) {
  const def = NODE_BY_ID.get((data as NodeData).registryId);
  if (!def) return null;

  return (
    <div
      className={cn(
        "group relative flex min-w-[9rem] items-center gap-2.5 rounded-lg border bg-graphite/80 px-3 py-2 backdrop-blur transition-shadow",
        selected
          ? "border-ai shadow-[0_0_0_2px_rgba(139,92,246,0.35)]"
          : "border-border/60 hover:border-border",
      )}
      style={{
        // Ponytail: use the accent as a subtle left-rail — one style prop
        // beats a whole per-provider className map.
        boxShadow: selected
          ? undefined
          : `inset 3px 0 0 0 ${def.accent}`,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border !border-border !bg-background"
      />

      <IconChip def={def} />

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium leading-tight">
          {(data as NodeData).label}
        </div>
        <div className="mt-0.5 truncate text-[10px] uppercase tracking-widest text-muted-foreground">
          {def.provider}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border !border-border !bg-background"
      />
    </div>
  );
}

function IconChip({ def }: { def: NodeDefinition }) {
  if (def.iconPath) {
    return (
      <Image
        src={def.iconPath}
        alt=""
        aria-hidden
        width={28}
        height={28}
        className="shrink-0"
        unoptimized // SVGs — no Next transform, straight through
      />
    );
  }
  // Fallback: initials chip in provider accent
  const initials = def.label
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[10px] font-semibold text-white"
      style={{ backgroundColor: def.accent }}
    >
      {initials}
    </div>
  );
}

export const CloudNode = memo(CloudNodeInner);
CloudNode.displayName = "CloudNode";
