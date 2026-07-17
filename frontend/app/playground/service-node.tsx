"use client";

// Custom React Flow node: a provider-colored clay tile with the official service
// mark, a status dot that pulses (reduced-motion drops the pulse), and two handles.
import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { useReducedMotion, motion } from "motion/react";
import { ServiceIcon, PROVIDER_COLOR } from "@/lib/brand-icons";
import { PROVIDER_META, type Provider } from "@/lib/catalog/nodes";
import { KIND_LABEL, type Kind } from "./kinds";
import { cn } from "@/lib/utils";

export type ServiceNodeData = {
  serviceId: string;
  name: string;
  provider: Provider;
  blurb: string;
  kind: Kind;
  status: "success" | "warning" | "danger";
};

export type ServiceFlowNode = Node<ServiceNodeData, "service">;

const STATUS_COLOR: Record<ServiceNodeData["status"], string> = {
  success: "var(--status-success)",
  warning: "var(--status-warning)",
  danger: "var(--status-danger)",
};

function ServiceNodeImpl({ data, selected }: NodeProps<ServiceFlowNode>) {
  const reduce = useReducedMotion();
  const color = PROVIDER_COLOR[data.provider];
  const statusColor = STATUS_COLOR[data.status];

  return (
    <div
      className={cn(
        "clay-pressable group relative w-[210px] rounded-2xl px-3.5 py-3 transition-shadow",
        selected && "ring-2 ring-accent-cyan",
      )}
      style={{ borderTop: `2px solid ${color}` }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!size-3 !border-2 !border-background"
        style={{ background: color }}
      />
      <div className="flex items-center gap-3">
        <span
          className="clay-inset grid size-11 shrink-0 place-items-center rounded-xl"
          style={{ boxShadow: `inset 0 0 0 1px ${color}33` }}
        >
          <ServiceIcon provider={data.provider} id={data.serviceId} name={data.name} size={26} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight text-foreground">{data.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {PROVIDER_META[data.provider].label} · {KIND_LABEL[data.kind]}
          </p>
        </div>
        <span className="relative ml-auto grid place-items-center" aria-label={`Status: ${data.status}`}>
          <span className="size-2.5 rounded-full" style={{ background: statusColor }} />
          {!reduce && (
            <motion.span
              className="absolute size-2.5 rounded-full"
              style={{ background: statusColor }}
              animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!size-3 !border-2 !border-background"
        style={{ background: color }}
      />
    </div>
  );
}

export const ServiceNode = memo(ServiceNodeImpl);
