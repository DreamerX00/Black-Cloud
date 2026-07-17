"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ClayPanel,
  ClayBadge,
  ClayDivider,
  ClayOrb,
} from "@/components/ui/clay";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Sparkles,
  Zap,
  ShieldCheck,
  Coins,
  Rocket,
  Check,
} from "@/components/icons";
import { cn } from "@/lib/utils";

interface Channel {
  key: string;
  title: string;
  hint: string;
  Icon: React.ComponentType<{ className?: string }>;
  tone: "ai" | "aws" | "azure" | "gcp" | "default";
  email: boolean;
  push: boolean;
}

const DEFAULT_CHANNELS: Channel[] = [
  {
    key: "copilot",
    title: "AI Copilot suggestions",
    hint: "When Copilot flags cost, security, or resilience concerns on your projects.",
    Icon: Sparkles,
    tone: "ai",
    email: true,
    push: true,
  },
  {
    key: "collab",
    title: "Comments & mentions",
    hint: "When a teammate mentions you or comments on a node you own.",
    Icon: Rocket,
    tone: "azure",
    email: true,
    push: true,
  },
  {
    key: "security",
    title: "Security alerts",
    hint: "New API keys, sign-ins from unrecognized devices, SSO changes.",
    Icon: ShieldCheck,
    tone: "default",
    email: true,
    push: true,
  },
  {
    key: "billing",
    title: "Billing & usage",
    hint: "Invoices, plan changes, and usage-cap warnings.",
    Icon: Coins,
    tone: "gcp",
    email: true,
    push: false,
  },
  {
    key: "product",
    title: "Product updates",
    hint: "New services, features, and the occasional roadmap peek.",
    Icon: Zap,
    tone: "aws",
    email: false,
    push: false,
  },
];

type Digest = "off" | "daily" | "weekly";

export function NotificationsPanel() {
  const [channels, setChannels] = useState(DEFAULT_CHANNELS);
  const [digest, setDigest] = useState<Digest>("daily");
  const [saving, setSaving] = useState(false);

  function toggle(key: string, field: "email" | "push") {
    setChannels((cs) =>
      cs.map((c) => (c.key === key ? { ...c, [field]: !c[field] } : c)),
    );
  }

  async function save() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Notification preferences saved");
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <ClayPanel elevation={3} tone="raised" className="relative overflow-hidden isolate p-6 tablet:p-8">
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-aws/20 blur-3xl" />
        <div className="relative z-10 flex items-center gap-4">
          <ClayOrb size="lg" tone="aws" className="animate-[float-y_5s_ease-in-out_infinite]">
            <Bell className="size-8" />
          </ClayOrb>
          <div className="space-y-1">
            <ClayBadge tone="aws" pulse>
              <Zap className="size-3" /> Signal, not noise
            </ClayBadge>
            <h2 className="font-display text-2xl font-semibold">Notifications</h2>
            <p className="text-sm text-ink-muted max-w-md">
              We only ping you when it matters. Everything else waits for the
              digest.
            </p>
          </div>
        </div>
      </ClayPanel>

      {/* Digest cadence */}
      <ClayPanel elevation={2} tone="raised" className="p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Digest cadence</h3>
        <ClayDivider />
        <div className="grid grid-cols-3 gap-2">
          {(["off", "daily", "weekly"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDigest(d)}
              className={cn(
                "rounded-clay-sm px-4 py-3 text-sm font-medium capitalize transition-all",
                digest === d
                  ? "clay shadow-clay-2 bg-[--clay-bg-2] text-ink ring-1 ring-ai/40"
                  : "clay-pressed bg-[--clay-bg-3] text-ink-muted hover:text-ink",
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </ClayPanel>

      {/* Channels matrix */}
      <ClayPanel elevation={2} tone="raised" className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-ai" />
          <h3 className="font-display text-lg font-semibold">What to send</h3>
        </div>
        <ClayDivider />
        <ul className="space-y-2">
          {channels.map((c) => (
            <li
              key={c.key}
              className="clay-pressed rounded-clay-sm bg-[--clay-bg-3] p-4 flex flex-col gap-3 tablet:flex-row tablet:items-center"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <ClayOrb size="sm" tone={c.tone}>
                  <c.Icon className="size-4" />
                </ClayOrb>
                <div className="min-w-0">
                  <div className="font-medium text-ink truncate">{c.title}</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">
                    {c.hint}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ToggleChip
                  label="Email"
                  checked={c.email}
                  onChange={() => toggle(c.key, "email")}
                />
                <ToggleChip
                  label="Push"
                  checked={c.push}
                  onChange={() => toggle(c.key, "push")}
                />
              </div>
            </li>
          ))}
        </ul>
      </ClayPanel>

      <div className="flex justify-end">
        <Button variant="clay-primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : (
            <>
              <Check className="size-4" /> Save preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function ToggleChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest transition-all",
        checked
          ? "clay shadow-clay-1 bg-ai/15 text-ai ring-1 ring-ai/30"
          : "clay-pressed bg-[--clay-bg-2] text-ink-dim hover:text-ink-muted",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full transition-colors",
          checked ? "bg-ai" : "bg-white/20",
        )}
      />
      {label}
    </button>
  );
}
