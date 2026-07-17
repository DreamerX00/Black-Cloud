"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";
import {
  ClayPanel,
  ClayBadge,
  ClayDivider,
  ClayOrb,
} from "@/components/ui/clay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Sparkles, Check } from "@/components/icons";

/**
 * ProfileForm — user identity + timezone. Client-side only (localStorage-
 * backed auth store for MVP). Save simulates a network round-trip so the
 * loading state is visible.
 */
export function ProfileForm() {
  const user = useAuth((s) => s.user);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [tz, setTz] = useState(
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
  );
  const [saving, setSaving] = useState(false);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Profile saved");
    setSaving(false);
  }

  const initial = (name || email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Identity hero */}
      <ClayPanel elevation={3} tone="raised" className="relative overflow-hidden isolate p-6 tablet:p-8">
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-ai/15 blur-3xl" />
        <div className="relative z-10 flex items-center gap-5">
          <ClayOrb size="xl" tone="ai" className="animate-[float-y_5s_ease-in-out_infinite] shrink-0">
            <span className="font-display text-3xl font-semibold text-white">{initial}</span>
          </ClayOrb>
          <div className="min-w-0 space-y-2">
            <ClayBadge tone="ai" pulse>
              <Sparkles className="size-3" /> Signed in
            </ClayBadge>
            <div className="min-w-0">
              <div className="font-display text-2xl font-semibold truncate">
                {name || "Unnamed captain"}
              </div>
              <div className="truncate text-[10px] font-mono uppercase tracking-widest text-ink-dim">
                {email || "no-email@example.com"}
              </div>
            </div>
          </div>
        </div>
      </ClayPanel>

      {/* Form */}
      <ClayPanel elevation={2} tone="raised" className="p-6 tablet:p-8">
        <form onSubmit={onSave} className="space-y-6">
          <div className="flex items-center gap-2">
            <User className="size-4 text-ai" />
            <h2 className="font-display text-lg font-semibold">Personal details</h2>
          </div>

          <ClayDivider />

          <div className="grid gap-5 tablet:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[10px] font-mono uppercase tracking-widest text-ink-dim">
                Display name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Captain Ada"
                className="clay-pressed rounded-clay-sm border-white/5 bg-[--clay-bg-3]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-ink-dim">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@ship.io"
                className="clay-pressed rounded-clay-sm border-white/5 bg-[--clay-bg-3]"
              />
            </div>
            <div className="space-y-1.5 tablet:col-span-2">
              <Label htmlFor="tz" className="text-[10px] font-mono uppercase tracking-widest text-ink-dim">
                Timezone
              </Label>
              <Input
                id="tz"
                value={tz}
                onChange={(e) => setTz(e.target.value)}
                className="clay-pressed rounded-clay-sm border-white/5 bg-[--clay-bg-3] font-mono text-sm"
              />
              <p className="text-[11px] text-ink-dim">
                Used for timestamps in exports and scheduled reports.
              </p>
            </div>
          </div>

          <ClayDivider />

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="clay-ghost"
              onClick={() => {
                setName(user?.name ?? "");
                setEmail(user?.email ?? "");
              }}
            >
              Reset
            </Button>
            <Button type="submit" variant="clay-primary" disabled={saving}>
              {saving ? "Saving…" : (
                <>
                  <Check className="size-4" /> Save changes
                </>
              )}
            </Button>
          </div>
        </form>
      </ClayPanel>

      {/* Danger zone */}
      <ClayPanel elevation={1} tone="deep" className="p-6 border border-danger/20">
        <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-danger">Delete account</h3>
            <p className="text-sm text-ink-muted mt-1 max-w-md">
              Permanently delete your workspace, projects, and API keys. This
              cannot be undone.
            </p>
          </div>
          <Button variant="brut-danger">Delete account</Button>
        </div>
      </ClayPanel>
    </div>
  );
}
