"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { create } from "zustand";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Workflow,
  Brain,
  ArrowRightLeft,
  Zap,
  History,
  Menu,
  X,
  Search,
  ChevronRight,
} from "lucide-react";
import { CONSOLE_NAV } from "@/lib/nav";

// ponytail: inline zustand store, no separate file needed
const useSidebar = create<{
  collapsed: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}>((set) => ({
  collapsed: false,
  mobileOpen: false,
  toggle: () => set((s) => ({ collapsed: !s.collapsed })),
  toggleMobile: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
  closeMobile: () => set({ mobileOpen: false }),
}));

// ponytail: map icon strings from nav config to actual components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Workflow,
  Brain,
  ArrowRightLeft,
  Zap,
  History,
};

function NavItem({
  item,
  collapsed,
  active,
}: {
  item: (typeof CONSOLE_NAV)[number];
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon ? iconMap[item.icon] : null;
  return (
    <Link
      href={item.href}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        active
          ? "bg-violet-500/15 text-violet-300"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-violet-500" />
      )}
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

interface AppFrameProps {
  children: ReactNode;
  title?: string;
}

export function AppFrame({ children, title }: AppFrameProps) {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggle, toggleMobile, closeMobile } =
    useSidebar();

  const sidebarW = collapsed ? "w-16" : "w-64";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`clay-panel glass fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/5 transition-all duration-200 ${sidebarW} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-white/5 px-4">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500" />
          {!collapsed && (
            <span className="text-gradient text-sm font-bold tracking-tight">
              BlackCloud
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {CONSOLE_NAV.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              active={pathname === item.href || pathname.startsWith(item.href + "/")}
            />
          ))}
        </nav>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={toggle}
          className="hidden border-t border-white/5 p-3 text-muted-foreground hover:text-foreground md:block"
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"}`}
          />
        </button>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="glass flex h-14 shrink-0 items-center gap-4 border-b border-white/5 px-4">
          <button
            onClick={toggleMobile}
            className="text-muted-foreground hover:text-foreground md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Breadcrumb */}
          <div className="hidden items-center gap-1.5 text-sm text-muted-foreground md:flex">
            <Link href="/dashboard" className="hover:text-foreground">
              Console
            </Link>
            {title && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-foreground">{title}</span>
              </>
            )}
          </div>

          <div className="flex-1" />

          {/* Command palette trigger */}
          <button className="clay-input flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search…</span>
            <kbd className="ml-2 hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] sm:inline">
              ⌘K
            </kbd>
          </button>

          {/* User avatar placeholder */}
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
        </header>

        {/* Content */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 overflow-y-auto p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
