"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Users, CreditCard, ShieldCheck, Plug, Bell, Palette, KeyRound } from "lucide-react";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/settings", label: "Overview", icon: Palette },
  { href: "/settings/profile", label: "Profile", icon: User },
  { href: "/settings/team", label: "Team & seats", icon: Users },
  { href: "/settings/billing", label: "Billing", icon: CreditCard },
  { href: "/settings/security", label: "Security", icon: ShieldCheck },
  { href: "/settings/integrations", label: "Integrations", icon: Plug },
  { href: "/settings/notifications", label: "Notifications", icon: Bell },
  { href: "/settings/api-keys", label: "API keys", icon: KeyRound },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <aside className="clay-sm sticky top-32 h-fit p-3">
      <ul className="space-y-0.5">
        {ITEMS.map(it => {
          const Icon = it.icon;
          const active = pathname === it.href;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  active ? "bg-white/8 text-ink" : "text-ink-dim hover:bg-white/5 hover:text-ink"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-ai" : "text-ink-mute")} />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
