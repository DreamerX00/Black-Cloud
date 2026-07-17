"use client";

// Left rail: the full CATALOG grouped by provider. Drag onto the canvas (HTML5 DnD
// sets a payload the canvas reads on drop) or click to drop at a default spot.
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { CATALOG, PROVIDER_META, type Provider, type Service } from "@/lib/catalog/nodes";
import { ServiceIcon, PROVIDER_COLOR } from "@/lib/brand-icons";
import { Input } from "@/components/ui/input";

const PROVIDERS: Provider[] = ["aws", "azure", "gcp"];

export function NodeLibrary({ onAdd }: { onAdd: (svc: Service) => void }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  return (
    <div className="clay flex h-full flex-col rounded-2xl p-4">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Services
      </h2>
      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search services…"
          className="clay-inset border-0 pl-9"
          aria-label="Search services"
        />
      </div>

      <div className="mt-4 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        {PROVIDERS.map((provider) => {
          const items = CATALOG.filter(
            (s) =>
              s.provider === provider &&
              (query === "" || s.name.toLowerCase().includes(query) || s.id.includes(query)),
          );
          if (items.length === 0) return null;
          return (
            <div key={provider}>
              <div className="mb-2 flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: PROVIDER_COLOR[provider] }} />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {PROVIDER_META[provider].label}
                </span>
              </div>
              <div className="space-y-1.5">
                {items.map((svc) => (
                  <button
                    key={svc.id}
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/blackcloud-service", svc.id);
                      e.dataTransfer.effectAllowed = "copy";
                    }}
                    onClick={() => onAdd(svc)}
                    className="clay-pressable group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left"
                    title={svc.blurb}
                  >
                    <ServiceIcon provider={svc.provider} id={svc.id} name={svc.name} size={22} />
                    <span className="truncate text-sm text-foreground">{svc.name}</span>
                    <Plus className="ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
