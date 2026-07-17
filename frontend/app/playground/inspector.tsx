"use client";

// Right-hand inspector: details of the selected node + its live connections.
import { motion, AnimatePresence } from "motion/react";
import { MousePointerClick, Link2, Trash2 } from "lucide-react";
import { ServiceIcon, PROVIDER_COLOR } from "@/lib/brand-icons";
import { PROVIDER_META } from "@/lib/catalog/nodes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { KIND_LABEL } from "./kinds";
import type { ServiceFlowNode } from "./service-node";

export function Inspector({
  node,
  connections,
  onDelete,
}: {
  node: ServiceFlowNode | null;
  connections: { id: string; name: string; provider: ServiceFlowNode["data"]["provider"]; serviceId: string; dir: "in" | "out" }[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="clay flex h-full flex-col rounded-2xl p-4">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Inspector
      </h2>
      <Separator className="my-3" />
      <AnimatePresence mode="wait">
        {node ? (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex items-center gap-3">
              <span
                className="clay-inset grid size-14 shrink-0 place-items-center rounded-2xl"
                style={{ boxShadow: `inset 0 0 0 1px ${PROVIDER_COLOR[node.data.provider]}33` }}
              >
                <ServiceIcon provider={node.data.provider} id={node.data.serviceId} name={node.data.name} size={34} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold leading-tight text-foreground">{node.data.name}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Badge variant="outline" style={{ color: PROVIDER_COLOR[node.data.provider] }}>
                    {PROVIDER_META[node.data.provider].label}
                  </Badge>
                  <Badge variant="cyan">{KIND_LABEL[node.data.kind]}</Badge>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{node.data.blurb}</p>

            <div className="mt-5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Link2 className="size-3.5" /> Connections ({connections.length})
            </div>
            <div className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
              {connections.length === 0 ? (
                <p className="text-xs text-muted-foreground/70">No connections yet. Drag from a handle to wire it up.</p>
              ) : (
                connections.map((c) => (
                  <div key={`${c.dir}-${c.id}`} className="clay-inset flex items-center gap-2.5 rounded-xl px-2.5 py-2">
                    <ServiceIcon provider={c.provider} id={c.serviceId} name={c.name} size={20} />
                    <span className="truncate text-sm text-foreground">{c.name}</span>
                    <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground">
                      {c.dir === "out" ? "→ out" : "in →"}
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => onDelete(node.id)}
              className="clay-pressable mt-4 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium text-status-danger"
            >
              <Trash2 className="size-4" /> Remove node
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground"
          >
            <span className="clay-inset grid size-14 place-items-center rounded-2xl">
              <MousePointerClick className="size-6 text-accent-cyan" />
            </span>
            <p className="max-w-[16rem] text-sm">Select a node on the canvas to inspect its details and connections.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
