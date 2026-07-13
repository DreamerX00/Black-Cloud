"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { searchCatalog, PROVIDER_META, type Provider } from "@/lib/catalog/nodes";
import { ProviderIcon } from "@/components/shared/provider-icon";

const PROVIDER_ORDER: Provider[] = ["aws", "azure", "gcp"];

/**
 * Service palette. Drag a row onto the canvas to add a node (HTML5 DnD; the
 * canvas reads the serviceId from dataTransfer). Also supports name/provider/
 * category search (MVP Search feature).
 */
export function NodePalette() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchCatalog(query), [query]);

  const grouped = useMemo(() => {
    const g: Record<Provider, typeof results> = { aws: [], azure: [], gcp: [] };
    for (const s of results) g[s.provider].push(s);
    return g;
  }, [results]);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-deep-space">
      <div className="border-b border-border p-3">
        <h2 className="mb-2 font-display text-sm font-semibold text-fg">
          Services
        </h2>
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-subtle"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services…"
            aria-label="Search services"
            className="w-full rounded-md border border-border-strong bg-void py-1.5 pl-8 pr-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus-visible:border-primary"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {results.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-fg-subtle">
            No services match “{query}”.
          </p>
        )}
        {PROVIDER_ORDER.map((provider) => {
          const items = grouped[provider];
          if (items.length === 0) return null;
          return (
            <section key={provider} className="mb-3">
              <p
                className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: PROVIDER_META[provider].accentVar }}
              >
                {PROVIDER_META[provider].label}
              </p>
              <ul>
                {items.map((svc) => (
                  <li key={svc.id}>
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("application/blackcloud-service", svc.id);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      className="flex cursor-grab items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-fg-muted transition-colors hover:bg-slate hover:text-fg active:cursor-grabbing"
                      title={svc.blurb}
                    >
                      <ProviderIcon serviceId={svc.id} size={20} />
                      <span className="truncate">{svc.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </aside>
  );
}
