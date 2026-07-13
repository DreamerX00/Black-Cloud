"use client";

import { useState } from "react";
import { useCanvas } from "@/store/canvas";
import { NODE_BY_ID, type NodeDefinition } from "@/lib/nodes/registry";
import type { RFNode } from "@/store/canvas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

/**
 * Right-hand inspector. Reveals when exactly one node is selected.
 * Deliberately narrow scope for MVP: name + read-only metadata.
 * Full config editing is deferred (out of MVP.md §Inspector).
 */
export function Inspector() {
  const nodes = useCanvas((s) => s.nodes);
  const renameNode = useCanvas((s) => s.renameNode);

  const selected = nodes.filter((n) => n.selected);
  const one = selected.length === 1 ? selected[0] : null;
  const def = one ? NODE_BY_ID.get(one.data.registryId) : null;

  return (
    <aside className="flex h-full w-80 flex-col border-l border-border/60 bg-space/60 backdrop-blur">
      <div className="border-b border-border/60 p-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Inspector
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!one || !def ? (
          <p className="text-sm text-muted-foreground">
            {selected.length > 1
              ? `${selected.length} nodes selected`
              : "Select a node to see its details."}
          </p>
        ) : (
          <NodeEditor
            key={one.id /* remount when selection changes → local state resets naturally */}
            node={one}
            def={def}
            onRename={(next) => renameNode(one.id, next)}
          />
        )}
      </div>
    </aside>
  );
}

/**
 * Sub-component gets a fresh mount every time selection changes because the
 * parent supplies `key={node.id}`. That's the React-canonical way to derive
 * state from props without an effect — no `set-state-in-effect` lint.
 */
function NodeEditor({
  node,
  def,
  onRename,
}: {
  node: RFNode;
  def: NodeDefinition;
  onRename: (label: string) => void;
}) {
  const [label, setLabel] = useState(node.data.label);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: def.accent }}
        />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {def.provider} · {def.category}
        </span>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="node-name">Name</Label>
        <Input
          id="node-name"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={() => {
            const next = label.trim();
            if (next && next !== node.data.label) {
              onRename(next);
            } else {
              setLabel(node.data.label);
            }
          }}
        />
      </div>

      <Separator />

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Service</dt>
          <dd className="mt-0.5">{def.fullName}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Description</dt>
          <dd className="mt-0.5 text-muted-foreground">{def.description}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Capabilities</dt>
          <dd className="mt-1 flex flex-wrap gap-1">
            {def.capabilities.map((c) => (
              <span
                key={c}
                className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                {c}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  );
}
