"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  Sparkles,
  ArrowLeftRight,
  ShieldAlert,
  Clock3,
  Coins,
  BrainCircuit,
  Settings,
  BookOpen,
  Bell,
  User,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { BlackCloudMark } from "@/components/brand/mark";

const NAV: Array<{ group: string; items: Array<{ href: string; label: string; icon: React.ComponentType<{ className?: string }>; tint?: string; badge?: string }> }> = [
  {
    group: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/projects", label: "Projects", icon: Boxes, badge: "6" },
    ],
  },
  {
    group: "Design",
    items: [
      { href: "/playground", label: "Cloud Playground", icon: Boxes, tint: "text-info" },
      { href: "/ai-architect", label: "AI Architect", icon: Sparkles, tint: "text-ai" },
    ],
  },
  {
    group: "Understand",
    items: [
      { href: "/simulator", label: "Failure Simulator", icon: ShieldAlert, tint: "text-danger" },
      { href: "/cost", label: "Cost Simulator", icon: Coins, tint: "text-success" },
      { href: "/health-score", label: "Health Score", icon: BrainCircuit, tint: "text-gcp" },
    ],
  },
  {
    group: "History",
    items: [
      { href: "/time-machine", label: "Time Machine", icon: Clock3, tint: "text-warn" },
      { href: "/migration", label: "Migration Ground", icon: ArrowLeftRight, tint: "text-aws" },
    ],
  },
  {
    group: "Account",
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/docs", label: "Docs", icon: BookOpen },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/5 bg-space/40 backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <BlackCloudMark className="h-6 w-6" />
            <span className="font-display text-base font-semibold">BlackCloud</span>
          </Link>
          <button
            data-cursor="magnet"
            className="clay-sm inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-mute hover:text-ink"
            aria-label="Notifications"
          >
            <Bell className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Org switcher */}
        <div className="border-b border-white/5 px-4 py-4">
          <button className="clay-sm flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-white/5">
            <span className="clay-sm grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-ai/40 to-info/20 font-display text-sm font-semibold">AL</span>
            <span className="flex-1 min-w-0">
              <span className="block truncate text-sm font-medium">Analytical Engines</span>
              <span className="block text-mono-caps text-ink-mute">Team · 12 seats</span>
            </span>
            <span className="text-ink-mute">⌄</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map(group => (
            <div key={group.group} className="mb-6">
              <div className="px-3 pb-2 text-mono-caps text-ink-mute">{group.group}</div>
              <ul className="flex flex-col gap-0.5">
                {group.items.map(it => {
                  const Icon = it.icon;
                  const active = pathname === it.href || (it.href !== "/dashboard" && pathname.startsWith(it.href));
                  return (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        data-cursor="magnet"
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                          active
                            ? "bg-white/8 text-ink"
                            : "text-ink-dim hover:bg-white/5 hover:text-ink"
                        )}
                      >
                        {active && (
                          <span className="absolute inset-y-1 left-0 w-1 rounded-full bg-ai" />
                        )}
                        <Icon className={cn("h-4 w-4 shrink-0", it.tint ?? "text-ink-mute", active && (it.tint ?? "text-ai"))} />
                        <span className="flex-1 truncate">{it.label}</span>
                        {it.badge && (
                          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-ink-dim">{it.badge}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Profile pill */}
        <div className="border-t border-white/5 p-3">
          <Link href="/settings/profile" className="clay-sm flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5">
            <span className="clay-sm grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-aws/40 to-ai/20 font-display text-sm font-semibold">AK</span>
            <span className="flex-1 min-w-0">
              <span className="block truncate text-sm font-medium">Akash Singh</span>
              <span className="block text-mono-caps text-ink-mute">Owner</span>
            </span>
            <User className="h-4 w-4 text-ink-mute" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
