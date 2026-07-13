"use client";

import { Copy, Trash2 } from "lucide-react";
import { useCanvasStore } from "@/store/canvasStore";
import { getService, PROVIDER_META } from "@/lib/catalog/nodes";
import { ProviderIcon } from "@/components/shared/provider-icon";
import type { Issue } from "@/features/validation/engine";

/**
 * Inspector for the selected node (MVP § Inspector Panel):
 * name (editable), service type, status, tags, connected services.
 * Also surfaces validation issues touching the selected node.
 */
export function Inspector({ issues }: { issues: Map<string, Issue> }) {
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const renameNode = useCanvasStore((s) => s.renameNode);
  const deleteNode = useCanvasStore((s) => s.deleteNode);
  const duplicateNode = useCanvasStore((s) => s.duplicateNode);

  const selected = nodes.find((n) => n.selected);

  if (!selected) {
    return (
      <aside className="flex h-full w-72 flex-col items-center justify-center border-l border-border bg-deep-space p-6 text-center">
        <p className="text-sm text-fg-subtle">
          Select a node to inspect its details.
        </p>
      </aside>
    );
  }

  const svc = getService(selected.data.serviceId);
  if (!svc) return null;

  const connections = edges
    .filter((e) => e.source === selected.id || e.target === selected.id)
    .map((e) => {
      const otherId = e.source === selected.id ? e.target : e.source;
      const other = nodes.find((n) => n.id === otherId);
      const dir = e.source === selected.id ? "→" : "←";
      return { id: e.id, dir, name: other?.data.name ?? otherId };
    });

  const nodeIssues = edges
    .filter((e) => e.source === selected.id || e.target === selected.id)
    .map((e) => issues.get(e.id))
    .filter((i): i is Issue => !!i);

  return (
    <aside className="flex h-full w-72 flex-col border-l border-border bg-deep-space">
      <div className="flex items-center gap-3 border-b border-border p-4">
        <div className="flex size-10 items-center justify-center rounded-md bg-void">
          <ProviderIcon serviceId={svc.id} size={26} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-fg">{selected.data.name}</p>
          <p
            className="text-xs font-medium"
            style={{ color: PROVIDER_META[svc.provider].accentVar }}
          >
            {PROVIDER_META[svc.provider].label} · {svc.label}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <Field label="Name">
          <input
            value={selected.data.name}
            onChange={(e) => renameNode(selected.id, e.target.value)}
            aria-label="Node name"
            className="w-full rounded-md border border-border-strong bg-void px-2.5 py-1.5 text-sm text-fg focus:outline-none focus-visible:border-primary"
          />
        </Field>

        <Field label="Service type">
          <p className="text-sm text-fg-muted">{svc.blurb}</p>
        </Field>

        <Field label="Category">
          <span className="inline-block rounded bg-slate px-2 py-0.5 text-xs capitalize text-fg-muted">
            {svc.category}
          </span>
        </Field>

        <Field label={`Connections (${connections.length})`}>
          {connections.length === 0 ? (
            <p className="text-xs text-fg-subtle">Not connected.</p>
          ) : (
            <ul className="space-y-1">
              {connections.map((c) => (
                <li key={c.id} className="text-sm text-fg-muted">
                  <span className="text-fg-subtle">{c.dir}</span> {c.name}
                </li>
              ))}
            </ul>
          )}
        </Field>

        {nodeIssues.length > 0 && (
          <Field label="Validation">
            <ul className="space-y-2">
              {nodeIssues.map((issue) => (
                <li
                  key={issue.edgeId}
                  className="rounded-md border p-2 text-xs"
                  style={{
                    borderColor:
                      issue.severity === "error"
                        ? "var(--color-danger)"
                        : "var(--color-warning)",
                  }}
                >
                  <p className="text-fg">{issue.message}</p>
                  {issue.suggestion && (
                    <p className="mt-1 text-fg-subtle">{issue.suggestion}</p>
                  )}
                </li>
              ))}
            </ul>
          </Field>
        )}
      </div>

      <div className="flex gap-2 border-t border-border p-3">
        <button
          onClick={() => duplicateNode(selected.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border-strong py-1.5 text-sm text-fg-muted transition-colors hover:bg-slate hover:text-fg"
        >
          <Copy size={14} /> Duplicate
        </button>
        <button
          onClick={() => deleteNode(selected.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border-strong py-1.5 text-sm text-danger transition-colors hover:bg-danger hover:text-white"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </p>
      {children}
    </div>
  );
}
