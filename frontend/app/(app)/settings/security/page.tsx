import type { Metadata } from "next";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { ShieldCheck, KeyRound, ScrollText, Fingerprint } from "lucide-react";

export const metadata: Metadata = { title: "Security" };

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <ClayCard variant="lg" glow="ai" className="p-8">
        <div className="flex items-start gap-4">
          <div className="clay-sm inline-flex h-12 w-12 items-center justify-center rounded-2xl text-ai"><ShieldCheck className="h-5 w-5" /></div>
          <div>
            <div className="text-mono-caps text-ai">SOC2 Type II · Continuous evidence</div>
            <div className="mt-1 font-display text-2xl font-semibold">Your workspace posture is good.</div>
            <p className="mt-2 text-sm text-ink-dim">MFA enforced · SSO configured · 0 sessions from unknown devices this month.</p>
          </div>
        </div>
      </ClayCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          { icon: Fingerprint, title: "Multi-factor auth", body: "Required for all owners and admins.", state: "enforced", tint: "text-success" },
          { icon: KeyRound, title: "SSO — SAML", body: "Okta / Microsoft Entra / Google Workspace.", state: "connected", tint: "text-success" },
          { icon: ScrollText, title: "Audit log", body: "Every graph mutation, every login. Export anytime.", state: "streaming", tint: "text-ai" },
          { icon: ShieldCheck, title: "Session policy", body: "12h maximum · re-auth for destructive actions.", state: "active", tint: "text-info" },
        ].map(c => {
          const Icon = c.icon;
          return (
            <ClayCard key={c.title} className="flex items-start justify-between gap-4 p-6">
              <div className="flex items-start gap-4">
                <div className={`clay-sm inline-flex h-10 w-10 items-center justify-center rounded-xl ${c.tint}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">{c.title}</div>
                  <p className="mt-1 text-sm text-ink-dim">{c.body}</p>
                  <div className={`mt-2 text-mono-caps ${c.tint}`}>{c.state}</div>
                </div>
              </div>
              <PillButton variant="ghost" size="sm">Manage</PillButton>
            </ClayCard>
          );
        })}
      </div>
    </div>
  );
}
