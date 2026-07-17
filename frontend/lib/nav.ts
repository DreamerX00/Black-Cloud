// Shared navigation model — used by navbar, command palette, and app-frame so
// every surface agrees on routes.
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Boxes,
  Sparkles,
  ArrowLeftRight,
  Siren,
  History,
  BookOpen,
  Tag,
  Users,
  Mail,
  ScrollText,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  desc?: string;
}

export const PRODUCT_NAV: NavItem[] = [
  { label: "Playground", href: "/product/playground", icon: Boxes, desc: "Design infrastructure on an infinite canvas." },
  { label: "AI Architect", href: "/product/ai-architect", icon: Sparkles, desc: "Generate architectures from a prompt." },
  { label: "Migration", href: "/product/migration", icon: ArrowLeftRight, desc: "Morph infrastructure across clouds." },
  { label: "Simulator", href: "/product/simulator", icon: Siren, desc: "Break things safely and watch traffic reroute." },
  { label: "Time Machine", href: "/product/time-machine", icon: History, desc: "Rewind and diff your architecture." },
];

export const MARKETING_NAV: NavItem[] = [
  { label: "Pricing", href: "/pricing", icon: Tag },
  { label: "Docs", href: "/docs", icon: BookOpen },
  { label: "About", href: "/about", icon: Users },
  { label: "Changelog", href: "/changelog", icon: ScrollText },
  { label: "Contact", href: "/contact", icon: Mail },
];

export const CONSOLE_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, desc: "Your projects at a glance." },
  { label: "Playground", href: "/playground", icon: Boxes, desc: "Live architecture canvas." },
  { label: "AI Architect", href: "/ai-architect", icon: Sparkles, desc: "Prompt-to-architecture." },
  { label: "Migration", href: "/migration", icon: ArrowLeftRight, desc: "Cross-cloud migration." },
  { label: "Simulator", href: "/simulator", icon: Siren, desc: "Failure simulation." },
  { label: "Time Machine", href: "/time-machine", icon: History, desc: "Version explorer." },
];
