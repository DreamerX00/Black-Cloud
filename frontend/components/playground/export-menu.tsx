"use client";

import { useState } from "react";
import { Download, FileJson, ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";
import { useCanvasStore } from "@/store/canvasStore";

/**
 * Export menu (MVP § Export System: PNG, SVG, JSON).
 *
 * JSON ships now — pure serialization, in-stack. PNG/SVG are disabled with a
 * visible reason: the React Flow raster/vector recipe needs `html-to-image`,
 * which is not in the approved tech stack. ponytail: enable both (~15 lines each)
 * once that dependency is ratified — do NOT ship a button that throws.
 */
export function ExportMenu({ projectName }: { projectName: string }) {
  const [open, setOpen] = useState(false);
  const snapshot = useCanvasStore((s) => s.snapshot);

  const exportJson = () => {
    const data = JSON.stringify(snapshot(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug(projectName)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
    toast.success("Exported JSON");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-sm text-fg-muted transition-colors hover:bg-slate hover:text-fg"
      >
        <Download size={15} /> Export
      </button>

      {open && (
        <>
          {/* click-away */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-56 rounded-md border border-border-strong bg-popover p-1 shadow-xl">
            <button
              onClick={exportJson}
              className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-sm text-fg hover:bg-slate"
            >
              <FileJson size={15} /> JSON
              <Check size={13} className="ml-auto text-success" />
            </button>
            <DisabledItem label="PNG" />
            <DisabledItem label="SVG" />
            <p className="px-2.5 py-1.5 text-[11px] leading-tight text-fg-subtle">
              Image export needs the <code className="text-fg-muted">html-to-image</code>{" "}
              dependency (pending stack approval).
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function DisabledItem({ label }: { label: string }) {
  return (
    <div className="flex w-full cursor-not-allowed items-center gap-2 rounded px-2.5 py-2 text-sm text-fg-subtle">
      <ImageIcon size={15} /> {label}
      <span className="ml-auto text-[10px] uppercase tracking-wide">soon</span>
    </div>
  );
}

const slug = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "diagram";
