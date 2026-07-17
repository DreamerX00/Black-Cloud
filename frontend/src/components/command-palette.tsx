"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Compass,
  Cloud,
  Boxes,
  BookText,
  Coins,
  Bell,
  LogIn,
  LayoutDashboard,
  Zap,
  Command as CommandIcon,
  Play,
  History,
} from "@/components/icons";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { NODE_REGISTRY } from "@/lib/nodes/registry";

/**
 * App-wide command palette.
 *
 * Opens on ⌘K / Ctrl+K globally, or via the header button that dispatches
 * a "bc:cmdk-toggle" CustomEvent. Groups:
 *   - Navigate      → routes across the app
 *   - Cloud services → node registry search (opens playground with node)
 *   - AI actions    → "Design architecture for..." → /architect
 *   - Recent        → last 5 opened projects (localStorage-backed)
 */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onToggle = () => setOpen((v) => !v);
    window.addEventListener("keydown", onKey);
    window.addEventListener("bc:cmdk-toggle", onToggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("bc:cmdk-toggle", onToggle);
    };
  }, []);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="BlackCloud Command"
      description="Navigate anywhere. Ask anything."
      className="clay shadow-clay-4 border-white/10"
    >
      <CommandInput placeholder="Where are we going?" />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>No matches — try a service name or a route.</CommandEmpty>

        <CommandGroup heading="Navigate">
          <PaletteItem icon={Compass} label="Home" onSelect={() => go("/")} shortcut="G H" />
          <PaletteItem icon={LayoutDashboard} label="Dashboard" onSelect={() => go("/dashboard")} shortcut="G D" />
          <PaletteItem icon={Boxes} label="Playground" onSelect={() => go("/playground")} shortcut="G P" />
          <PaletteItem icon={Cloud} label="Migrate" onSelect={() => go("/migrate")} shortcut="G M" />
          <PaletteItem icon={Zap} label="Simulate" onSelect={() => go("/simulate")} shortcut="G S" />
          <PaletteItem icon={Coins} label="Pricing" onSelect={() => go("/pricing")} />
          <PaletteItem icon={BookText} label="Docs" onSelect={() => go("/docs")} />
          <PaletteItem icon={Bell} label="Changelog" onSelect={() => go("/changelog")} />
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="AI Actions">
          <PaletteItem
            icon={Sparkles}
            label="Design an architecture from a prompt"
            onSelect={() => go("/architect")}
            accent="ai"
          />
          <PaletteItem
            icon={Play}
            label="Analyze cost of the current project"
            onSelect={() => go("/dashboard?panel=cost")}
            accent="ai"
          />
          <PaletteItem
            icon={CommandIcon}
            label="Run a failure simulation"
            onSelect={() => go("/simulate")}
            accent="ai"
          />
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Cloud services (opens Playground)">
          {NODE_REGISTRY.slice(0, 12).map((node) => (
            <PaletteItem
              key={node.id}
              icon={Cloud}
              label={node.fullName}
              hint={node.provider.toUpperCase()}
              accent={node.provider}
              onSelect={() => go(`/playground/new?with=${node.id}`)}
            />
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          <PaletteItem icon={LogIn} label="Sign in" onSelect={() => go("/login")} />
          <PaletteItem icon={History} label="Recent projects" onSelect={() => go("/dashboard?tab=recent")} />
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function PaletteItem({
  icon: Icon,
  label,
  hint,
  shortcut,
  accent,
  onSelect,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint?: string;
  shortcut?: string;
  accent?: "aws" | "azure" | "gcp" | "ai";
  onSelect: () => void;
}) {
  const accentColor =
    accent === "aws"
      ? "text-aws"
      : accent === "azure"
        ? "text-azure"
        : accent === "gcp"
          ? "text-gcp"
          : accent === "ai"
            ? "text-ai"
            : "text-ink-muted";
  return (
    <CommandItem onSelect={onSelect} className="gap-3 py-2.5">
      <Icon className={`size-4 ${accentColor}`} />
      <span className="flex-1">{label}</span>
      {hint && (
        <span className="text-[10px] font-mono uppercase tracking-widest text-ink-dim">
          {hint}
        </span>
      )}
      {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
    </CommandItem>
  );
}
