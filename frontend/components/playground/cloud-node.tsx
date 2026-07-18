"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/cn";

export type CloudNodeData = {
  label: string;
  short: string;
  provider: "aws" | "azure" | "gcp";
  color: string;
  status?: "ok" | "warning" | "error";
};

const providerRing = {
  aws: "shadow-glow-aws",
  azure: "shadow-glow-azure",
  gcp: "shadow-glow-gcp",
} as const;

const statusDot = {
  ok: "bg-success",
  warning: "bg-warn",
  error: "bg-danger",
} as const;

export function CloudNode(props: NodeProps) {
  const data = props.data as CloudNodeData;
  const status = data.status ?? "ok";
  return (
    <div
      className={cn(
        "clay group relative flex min-w-[180px] items-center gap-3 rounded-2xl p-3 transition-transform",
        props.selected && "ring-2 ring-ai",
        providerRing[data.provider]
      )}
      style={{
        // A soft accent shadow from the node's color
        boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 12px 32px -12px ${data.color}66, 0 4px 8px rgba(0,0,0,0.5)`,
      }}
    >
      <Handle type="target" position={Position.Left} className="!h-3 !w-3 !border-0 !bg-white/50" />
      <div
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-mono text-xs font-semibold text-void"
        style={{ background: data.color }}
      >
        {data.short}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-mono-caps text-ink-mute">{data.provider}</div>
        <div className="truncate text-sm font-medium text-ink">{data.label}</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className={cn("h-2 w-2 rounded-full animate-pulse-slow", statusDot[status])} />
      </div>
      <Handle type="source" position={Position.Right} className="!h-3 !w-3 !border-0 !bg-white/50" />
    </div>
  );
}
