import type { Metadata } from "next";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { Download } from "lucide-react";

export const metadata: Metadata = { title: "Billing" };

const INVOICES = [
  { d: "2026-07-01", n: "INV-2026-07", a: "$948.00", s: "paid" },
  { d: "2026-06-01", n: "INV-2026-06", a: "$948.00", s: "paid" },
  { d: "2026-05-01", n: "INV-2026-05", a: "$632.00", s: "paid" },
  { d: "2026-04-01", n: "INV-2026-04", a: "$316.00", s: "paid" },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <ClayCard variant="lg" glow="success" className="relative overflow-hidden p-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-30" />
        <div className="relative flex items-start justify-between gap-6">
          <div>
            <div className="text-mono-caps text-success">Plan</div>
            <div className="mt-2 font-display text-3xl font-semibold">Team · 12 seats</div>
            <p className="mt-2 text-ink-dim">$79 / seat / mo · billed monthly · renews Aug 01.</p>
          </div>
          <div className="flex gap-2">
            <PillButton variant="ghost">Manage seats</PillButton>
            <PillButton>Upgrade to Enterprise</PillButton>
          </div>
        </div>
      </ClayCard>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { l: "This month", v: "$948", h: "12 seats × $79" },
          { l: "Usage overage", v: "$0", h: "under quota" },
          { l: "Annual saved", v: "$0", h: "monthly billing" },
          { l: "Next invoice", v: "Aug 01", h: "auto-charge" },
        ].map(k => (
          <ClayCard key={k.l} className="p-5">
            <div className="font-display text-2xl font-semibold">{k.v}</div>
            <div className="text-mono-caps text-ink-mute">{k.l}</div>
            <div className="mt-1 text-xs text-ink-mute/70">{k.h}</div>
          </ClayCard>
        ))}
      </div>

      <ClayCard className="overflow-hidden">
        <div className="border-b border-white/8 p-6">
          <div className="text-mono-caps text-ink-mute">Invoices</div>
        </div>
        <table className="w-full">
          <thead className="border-b border-white/8">
            <tr className="text-mono-caps text-ink-mute">
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Number</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {INVOICES.map(inv => (
              <tr key={inv.n} className="hover:bg-white/[0.02]">
                <td className="p-4 text-sm text-ink-dim">{inv.d}</td>
                <td className="p-4 text-sm font-mono">{inv.n}</td>
                <td className="p-4 text-right font-display font-semibold">{inv.a}</td>
                <td className="p-4"><span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-mono uppercase text-success">{inv.s}</span></td>
                <td className="p-4 text-right">
                  <button className="text-ink-mute hover:text-ink"><Download className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ClayCard>
    </div>
  );
}
