"use client";

// Console shell for authenticated app surfaces: clay sidebar (CONSOLE_NAV),
// top bar (⌘K search trigger, theme toggle, avatar), content slot. Sidebar
// collapses to a sheet on mobile. A subtle aurora sits behind everything so the
// app still feels part of the universe.
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Cloud, Search, Menu, X, Command } from "lucide-react";
import { CONSOLE_NAV } from "@/lib/nav";
import { AuroraBackground } from "@/components/effects/aurora-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1.5 px-3" aria-label="Console">
      {CONSOLE_NAV.map((item) => {
        const Icon = item.icon;
        const activeItem = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={activeItem ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              activeItem
                ? "clay-inset text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0 transition-colors",
                activeItem ? "text-accent-cyan" : "text-muted-foreground group-hover:text-accent-cyan",
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppFrame({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AuroraBackground className="pointer-events-none fixed inset-0 -z-10 opacity-20" />

      {/* Desktop sidebar */}
      <aside className="clay fixed inset-y-0 left-0 z-30 hidden w-64 flex-col rounded-none py-6 md:flex">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-5">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-accent-violet to-accent-cyan text-white shadow-sm">
            <Cloud className="size-4" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-gradient">BLACKCLOUD</span>
        </Link>
        <SidebarNav />
        <div className="mt-auto px-5 pt-4 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar (sheet) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="clay fixed inset-y-0 left-0 z-50 flex w-64 flex-col rounded-none py-6 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="mb-8 flex items-center justify-between px-5">
                <span className="font-display text-lg font-bold text-gradient">BLACKCLOUD</span>
                <button aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                  <X className="size-5 text-muted-foreground" />
                </button>
              </div>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="md:pl-64">
        <header className="glass sticky top-0 z-20 flex items-center gap-4 rounded-none border-b px-4 py-3 sm:px-6">
          <button
            aria-label="Open menu"
            className="clay-pressable grid size-9 place-items-center md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">{title}</h1>
          <div className="ml-auto flex items-center gap-2.5">
            <button
              onClick={() =>
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))
              }
              className="clay-pressable hidden items-center gap-2 px-3 py-2 text-xs text-muted-foreground sm:flex"
            >
              <Search className="size-3.5" /> Search
              <kbd className="flex items-center gap-0.5 rounded border border-border px-1 text-[10px]">
                <Command className="size-2.5" />K
              </kbd>
            </button>
            {actions}
            <ThemeToggle />
            <Avatar>
              <AvatarFallback>BC</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="relative p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
