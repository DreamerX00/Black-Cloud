"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ClayPanel,
  ClayBadge,
  ClayDivider,
  ClayOrb,
  BrutAlert,
} from "@/components/ui/clay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  KeyRound,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
} from "@/components/icons";
import { cn } from "@/lib/utils";

interface ApiKey {
  id: string;
  label: string;
  prefix: string; // safe-to-display first 8 chars
  full: string;   // for reveal + copy (in a real app this would be created once and never re-fetched)
  createdAt: string;
  lastUsed: string | null;
  scope: "read" | "write" | "admin";
}

const SEED: ApiKey[] = [
  {
    id: "k1",
    label: "GitHub Action · deploy",
    prefix: "bc_live_",
    full: "bc_live_a3f92c1d9b8e7f6a5c4b3d2e1f0a9b8c",
    createdAt: "Jun 12, 2026",
    lastUsed: "3 hours ago",
    scope: "write",
  },
  {
    id: "k2",
    label: "Terraform CI",
    prefix: "bc_live_",
    full: "bc_live_7d6e5f4c3b2a1908f7e6d5c4b3a29180",
    createdAt: "May 03, 2026",
    lastUsed: "yesterday",
    scope: "read",
  },
];

const SCOPE_TONE: Record<ApiKey["scope"], "ai" | "azure" | "gcp"> = {
  read: "azure",
  write: "ai",
  admin: "gcp",
};

/**
 * ApiKeysPanel — creates and manages tokens. In-memory only for MVP.
 * ponytail: real API would create-once-return-secret, we mirror that flow.
 */
export function ApiKeysPanel() {
  const [keys, setKeys] = useState<ApiKey[]>(SEED);
  const [label, setLabel] = useState("");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  function create() {
    if (!label.trim()) {
      toast.error("Give the key a label first");
      return;
    }
    const rand = Array.from({ length: 32 }, () =>
      "0123456789abcdef"[Math.floor(Math.random() * 16)],
    ).join("");
    const next: ApiKey = {
      id: `k${Date.now()}`,
      label: label.trim(),
      prefix: "bc_live_",
      full: `bc_live_${rand}`,
      createdAt: new Date().toLocaleDateString(),
      lastUsed: null,
      scope: "write",
    };
    setKeys((k) => [next, ...k]);
    setRevealed((r) => ({ ...r, [next.id]: true }));
    setLabel("");
    toast.success("Key created — copy it now, you won't see the full secret again.");
  }

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  }

  function revoke(id: string) {
    setKeys((k) => k.filter((x) => x.id !== id));
    toast.success("Key revoked");
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <ClayPanel elevation={3} tone="raised" className="relative overflow-hidden isolate p-6 tablet:p-8">
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-gcp/20 blur-3xl" />
        <div className="relative z-10 flex items-center gap-4">
          <ClayOrb size="lg" tone="gcp">
            <KeyRound className="size-8" />
          </ClayOrb>
          <div className="space-y-1">
            <ClayBadge tone="gcp">
              <ShieldCheck className="size-3" /> Server-side only
            </ClayBadge>
            <h2 className="font-display text-2xl font-semibold">API keys</h2>
            <p className="text-sm text-ink-muted">
              Programmatic access to projects, graphs, and exports. Never
              embed a live key in browser code.
            </p>
          </div>
        </div>
      </ClayPanel>

      {/* Create */}
      <ClayPanel elevation={2} tone="raised" className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="size-4 text-ai" />
          <h3 className="font-display text-lg font-semibold">Create a new key</h3>
        </div>
        <ClayDivider />
        <div className="flex flex-col gap-3 tablet:flex-row">
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. GitHub Action · staging"
            className="clay-pressed flex-1 rounded-clay-sm border-white/5 bg-[--clay-bg-3]"
          />
          <Button variant="clay-primary" onClick={create}>
            <Sparkles className="size-4" /> Generate key
          </Button>
        </div>
      </ClayPanel>

      {/* Keys */}
      <ClayPanel elevation={2} tone="raised" className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound className="size-4 text-ai" />
          <h3 className="font-display text-lg font-semibold">Active keys</h3>
          <ClayBadge tone="default" className="ml-auto text-[9px]">
            {keys.length} active
          </ClayBadge>
        </div>
        <ClayDivider />
        {keys.length === 0 ? (
          <BrutAlert tone="info">
            No keys yet — generate one above to start hitting the API.
          </BrutAlert>
        ) : (
          <ul className="space-y-2">
            {keys.map((k) => (
              <li
                key={k.id}
                className={cn(
                  "clay-pressed rounded-clay-sm bg-[--clay-bg-3] p-4",
                  "flex flex-col gap-3 tablet:flex-row tablet:items-start",
                )}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink truncate">{k.label}</span>
                    <ClayBadge tone={SCOPE_TONE[k.scope]} className="text-[9px]">
                      {k.scope}
                    </ClayBadge>
                  </div>
                  <code className="block truncate font-mono text-xs text-ink-muted">
                    {revealed[k.id] ? k.full : `${k.prefix}${"•".repeat(24)}`}
                  </code>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-ink-dim">
                    Created {k.createdAt} · Last used {k.lastUsed ?? "never"}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon-sm"
                    variant="clay-ghost"
                    className="rounded-full"
                    onClick={() =>
                      setRevealed((r) => ({ ...r, [k.id]: !r[k.id] }))
                    }
                    aria-label={revealed[k.id] ? "Hide" : "Reveal"}
                  >
                    {revealed[k.id] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="clay-ghost"
                    className="rounded-full"
                    onClick={() => copy(k.full)}
                    aria-label="Copy key"
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="clay-ghost"
                    className="rounded-full text-danger hover:bg-danger/10"
                    onClick={() => revoke(k.id)}
                    aria-label="Revoke"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ClayPanel>

      <BrutAlert tone="warning">
        <div className="space-y-1">
          <div className="font-medium">Store keys as environment variables.</div>
          <p className="text-[11px] opacity-90">
            Any key committed to a repo — public or private — should be
            revoked and rotated within 15 minutes.
          </p>
        </div>
      </BrutAlert>
    </div>
  );
}
