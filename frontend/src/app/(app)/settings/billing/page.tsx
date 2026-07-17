import type { Metadata } from "next";
import Link from "next/link";
import {
  ClayPanel,
  ClayBadge,
  ClayDivider,
  ClayOrb,
} from "@/components/ui/clay";
import { Button } from "@/components/ui/button";
import {
  Coins,
  Sparkles,
  ArrowRight,
  Rocket,
  Check,
  DocDownload,
} from "@/components/icons";

export const metadata: Metadata = { title: "Billing · Settings" };

const INVOICES = [
  { id: "INV-2026-07-001", date: "Jul 01, 2026", amount: "$24.00", status: "Paid" },
  { id: "INV-2026-06-001", date: "Jun 01, 2026", amount: "$24.00", status: "Paid" },
  { id: "INV-2026-05-001", date: "May 01, 2026", amount: "$24.00", status: "Paid" },
];

const USAGE = [
  { label: "Projects", value: 4, cap: null },
  { label: "AI Copilot msgs", value: 128, cap: 500 },
  { label: "Exports this month", value: 41, cap: null },
];

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Current plan */}
      <ClayPanel
        elevation={4}
        tone="ai"
        className="relative overflow-hidden isolate p-6 tablet:p-8"
      >
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-72 rounded-full bg-ai/20 blur-3xl" />
        <div className="relative z-10 grid gap-6 tablet:grid-cols-[1fr_auto] tablet:items-center">
          <div className="space-y-3">
            <ClayBadge tone="ai" pulse>
              <Sparkles className="size-3" /> Current plan
            </ClayBadge>
            <div className="font-display text-3xl font-semibold tracking-tight">
              Constellation ·{" "}
              <span className="text-gradient-provider">$24</span>
              <span className="text-base text-ink-dim font-normal">/seat/month</span>
            </div>
            <p className="text-sm text-ink-muted max-w-md">
              Renews Aug 1, 2026 · 1 seat · ACH on file
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="clay-ghost" size="lg">
              <Link href="/pricing">Compare plans</Link>
            </Button>
            <Button variant="clay-primary" size="lg">
              <Rocket className="size-4" /> Upgrade to Nebula
            </Button>
          </div>
        </div>
      </ClayPanel>

      {/* Usage */}
      <ClayPanel elevation={2} tone="raised" className="p-6 tablet:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Coins className="size-4 text-ai" />
          <h2 className="font-display text-lg font-semibold">This billing period</h2>
        </div>
        <ClayDivider />
        <div className="grid gap-4 tablet:grid-cols-3">
          {USAGE.map((u) => (
            <div key={u.label} className="clay-pressed rounded-clay-sm p-4 bg-[--clay-bg-3] space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-ink-dim">
                {u.label}
              </div>
              <div className="flex items-baseline gap-1">
                <div className="font-display text-3xl font-semibold text-ink">
                  {u.value}
                </div>
                {u.cap && (
                  <div className="text-xs text-ink-dim">/ {u.cap}</div>
                )}
              </div>
              {u.cap && (
                <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-ai to-azure"
                    style={{ width: `${Math.min(100, (u.value / u.cap) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </ClayPanel>

      {/* Payment method */}
      <ClayPanel elevation={2} tone="raised" className="p-6 tablet:p-8">
        <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex items-center gap-4">
            <ClayOrb size="md" tone="default">
              <Coins className="size-6" />
            </ClayOrb>
            <div>
              <div className="font-medium text-ink">Bank · ACH ending 4242</div>
              <div className="text-xs text-ink-muted mt-0.5">
                <Check className="inline size-3 text-ai" /> Verified
              </div>
            </div>
          </div>
          <Button variant="clay">Update payment method</Button>
        </div>
      </ClayPanel>

      {/* Invoices */}
      <ClayPanel elevation={2} tone="raised" className="p-6 tablet:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Invoice history</h2>
          <Button variant="clay-ghost" size="sm">
            View all <ArrowRight className="size-3" />
          </Button>
        </div>
        <ClayDivider className="my-4" />
        <ul className="divide-y divide-white/[0.04]">
          {INVOICES.map((inv) => (
            <li key={inv.id} className="flex items-center gap-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm text-ink truncate">{inv.id}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-ink-dim">
                  {inv.date}
                </div>
              </div>
              <div className="text-sm text-ink">{inv.amount}</div>
              <ClayBadge tone="ai" className="text-[9px]">
                <Check className="size-2.5" /> {inv.status}
              </ClayBadge>
              <Button size="icon-sm" variant="clay-ghost" className="rounded-full">
                <DocDownload className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </ClayPanel>
    </div>
  );
}
