"use client";

import { useEffect } from "react";
import { Redo2, Save, Trash2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCanvas } from "@/store/canvas";

interface Props {
  projectName: string;
  saving: boolean;
  lastSavedAt: string | null;
  onManualSave: () => void;
}

export function CanvasToolbar({ projectName, saving, lastSavedAt, onManualSave }: Props) {
  const undo = useCanvas((s) => s.undo);
  const redo = useCanvas((s) => s.redo);
  const removeSelected = useCanvas((s) => s.removeSelected);

  // Keyboard shortcuts — MVP.md §Canvas Features requirement.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t?.tagName === "INPUT" || t?.tagName === "TEXTAREA" || t?.isContentEditable)
        return;
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((meta && e.key === "z" && e.shiftKey) || (meta && e.key === "y")) {
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
    <div className="pointer-events-auto flex items-center gap-2 rounded-md border border-border/60 bg-graphite/80 px-2 py-1.5 backdrop-blur">
      <span className="max-w-[16rem] truncate font-medium text-sm">
        {projectName}
      </span>
      <Separator orientation="vertical" className="h-5" />

      <ToolbarButton label="Undo (⌘Z)" onClick={undo}>
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Redo (⌘⇧Z)" onClick={redo}>
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Delete selection (Del)" onClick={removeSelected}>
        <Trash2 className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-5" />

      <div className="text-[10px] text-muted-foreground">
        {saving
          ? "Saving…"
          : lastSavedAt
            ? `Saved ${new Date(lastSavedAt).toLocaleTimeString()}`
            : "Unsaved"}
      </div>

      <ToolbarButton label="Save (⌘S)" onClick={onManualSave}>
        <Save className="h-4 w-4" />
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
          size="icon"
          variant="ghost"
          className="h-7 w-7"
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
