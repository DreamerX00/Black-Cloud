import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { CloudNode as CloudNodeType } from "@/types/graph";
import { getService, PROVIDER_META } from "@/lib/catalog/nodes";
import { ProviderIcon } from "@/components/shared/provider-icon";
import { cn } from "@/lib/utils";

/**
 * Custom React Flow node. Anatomy per DESIGN_SYSTEM: provider-accented icon tile,
 * name, service label. Left/right handles allow directed connections.
 *
 * memo() because React Flow re-renders nodes on every viewport change; the node
 * only needs to repaint when its own props change — essential for the 100-node
 * 60fps target.
 */
export const CloudNode = memo(function CloudNode({
  data,
  selected,
}: NodeProps<CloudNodeType>) {
  const svc = getService(data.serviceId);
  if (!svc) return null;
  const accent = PROVIDER_META[svc.provider].accentVar;

  return (
    <div
      className={cn(
        "group relative flex w-44 items-center gap-3 rounded-lg border bg-graphite px-3 py-2.5 transition-shadow",
        selected ? "border-primary shadow-[0_0_0_1px_var(--color-primary)]" : "border-border-strong",
      )}
    >
      {/* provider accent rail */}
      <span
        aria-hidden
        className="absolute inset-y-2 left-0 w-1 rounded-full"
        style={{ backgroundColor: accent }}
      />

      <div className="flex size-9 items-center justify-center rounded-md bg-void">
        <ProviderIcon serviceId={svc.id} size={24} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-fg">{data.name}</p>
        <p className="truncate text-xs text-fg-subtle">{svc.label}</p>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!size-2 !border-none !bg-fg-subtle"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!size-2 !border-none !bg-fg-subtle"
      />
    </div>
  );
});
