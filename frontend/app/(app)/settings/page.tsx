import type { Metadata } from "next";
import Link from "next/link";
import { ClayCard } from "@/components/ui/clay-card";
import { User, CreditCard, ShieldCheck, Plug, Users, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "Settings" };

const CARDS = [
  { icon: User, href: "/settings/profile", title: "Profile", body: "Name, avatar, timezone, keyboard preferences." },
  { icon: Users, href: "/settings/team", title: "Team & seats", body: "Invite, roles, single-source-of-truth ownership." },
  { icon: CreditCard, href: "/settings/billing", title: "Billing", body: "Plan, invoices, usage metering, payment methods." },
  { icon: ShieldCheck, href: "/settings/security", title: "Security", body: "SSO, MFA, session policy, audit logs." },
  { icon: Plug, href: "/settings/integrations", title: "Integrations", body: "GitHub, PagerDuty, Slack, cloud accounts." },
];

export default function SettingsOverview() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {CARDS.map(c => {
        const Icon = c.icon;
        return (
          <Link key={c.href} href={c.href}>
            <ClayCard interactive className="group flex h-full flex-col gap-4 p-6">
              <div className="clay-sm inline-flex h-11 w-11 items-center justify-center rounded-xl text-ai">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="font-display text-lg font-semibold">{c.title}</div>
                <p className="mt-1 text-sm text-ink-dim">{c.body}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1 text-sm text-ai opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </ClayCard>
          </Link>
        );
      })}
    </div>
  );
}
