"use client";

import { useEffect } from "react";
import {
  Redo2,
  Save,
  Trash2,
  Undo2,
  ArrowLeft,
  Loader2,
  DotFilled,
} from "@/components/icons";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ClayDivider } from "@/components/ui/clay";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCanvas } from "@/store/canvas";
import { cn } from "@/lib/utils";

interface Props {
  projectName: string;
  saving: boolean;
  lastSavedAt: string | null;
  onManualSave: () => void;
}

/**
 * CanvasToolbar — a glass HUD that floats above the canvas.
 *
 * Per DESIGN_SYSTEM §Surface Styles, floating controls use glassmorphism
 * rather than clay — clay is for anchored panels, glass is for hovering
 * chrome. This gives the canvas layer visual priority (clay reads as
 * "part of the room"; glass reads as "on top of the world").
 */
export function CanvasToolbar({
  projectName,
  saving,
  lastSavedAt,
  onManualSave,
}: Props) {
  const undo = useCanvas((s) => s.undo);
  const redo = useCanvas((s) => s.redo);
  const removeSelected = useCanvas((s) => s.removeSelected);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (
        t?.tagName === "INPUT" ||
        t?.tagName === "TEXTAREA" ||
        t?.isContentEditable
      )
        return;
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (meta && e.key === "z" && e.shiftKey) ||
        (meta && e.key === "y")
      ) {
        e.preventDefault();
        redo();
      } else if (meta && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onManualSave();
        toast.success("Saved");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, onManualSave]);

  return (
    <div className="pointer-events-auto glass-strong flex items-center gap-2 rounded-clay-full px-2 py-1.5">
      {/* Back to dashboard */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/dashboard"
            data-magnetic
            className={cn(
              "flex size-8 items-center justify-center rounded-full",
              "text-ink-dim hover:text-ink hover:bg-white/[0.06] transition-colors",
            )}
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="size-4" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Back to projects</TooltipContent>
      </Tooltip>

      <ClayDivider orientation="vertical" className="mx-1 h-6" />

      <span className="max-w-[16rem] truncate font-medium text-sm text-ink">
        {projectName}
      </span>

      <ClayDivider orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton label="Undo (⌘Z)" onClick={undo}>
        <Undo2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Redo (⌘⇧Z)" onClick={redo}>
        <Redo2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Delete selection (Del)" onClick={removeSelected}>
        <Trash2 className="size-4" />
      </ToolbarButton>

      <ClayDivider orientation="vertical" className="mx-1 h-6" />

      {/* Save state pill */}
      <div className="flex items-center gap-1.5 rounded-full bg-white/[0.03] px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest">
        {saving ? (
          <>
            <Loader2 className="size-3 animate-spin text-ai" />
            <span className="text-ink-dim">Saving</span>
          </>
        ) : lastSavedAt ? (
          <>
            <DotFilled className="size-3 text-success" />
            <span className="text-ink-dim">
              Saved · {new Date(lastSavedAt).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </>
        ) : (
          <>
            <DotFilled className="size-3 text-warning" />
            <span className="text-ink-dim">Unsaved</span>
          </>
        )}
      </div>

      <ToolbarButton label="Save (⌘S)" onClick={onManualSave}>
        <Save className="size-4" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon-sm"
          variant="clay-ghost"
          className="rounded-full"
          onClick={onClick}
          aria-label={label}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
