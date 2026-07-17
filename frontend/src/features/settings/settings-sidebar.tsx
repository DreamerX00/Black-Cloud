"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "@/components/motion/primitives";
import {
  User,
  Coins,
  KeyRound,
  Bell,
  ChevronRight,
} from "@/components/icons";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Profile", href: "/settings/profile", Icon: User, hint: "Name, avatar, timezone" },
  { label: "Billing", href: "/settings/billing", Icon: Coins, hint: "Plan, invoices, seats" },
  { label: "API keys", href: "/settings/api-keys", Icon: KeyRound, hint: "Tokens & webhooks" },
  { label: "Notifications", href: "/settings/notifications", Icon: Bell, hint: "Emails & digests" },
];

/**
 * SettingsSidebar — claymorphic rail with an animated active pill.
 * The pill uses layoutId so switching pages morphs the highlight rather
 * than remounting it — matches the header's nav-pill treatment.
 */
export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="tablet:sticky tablet:top-24 tablet:h-fit">
      <nav className="clay shadow-clay-2 rounded-clay p-2 space-y-1 bg-[--clay-bg-2]">
        {ITEMS.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "relative flex items-center gap-3 rounded-clay-sm px-3 py-2.5 text-sm transition-colors",
                active
                  ? "text-ink"
                  : "text-ink-muted hover:text-ink hover:bg-white/[0.03]",
              )}
            >
              {active && (
                <motion.span
                  layoutId="settings-pill"
                  className="absolute inset-0 rounded-clay-sm bg-white/[0.06] shadow-clay-1"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <it.Icon className={cn("relative size-4 shrink-0", active && "text-ai")} />
              <div className="relative flex-1 min-w-0">
                <div className="truncate">{it.label}</div>
                <div className="truncate text-[10px] text-ink-dim font-mono uppercase tracking-widest">
                  {it.hint}
                </div>
              </div>
              <ChevronRight
                className={cn(
                  "relative size-3 shrink-0 transition-transform",
                  active ? "text-ink translate-x-0" : "text-ink-dim opacity-0 -translate-x-1",
                )}
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
