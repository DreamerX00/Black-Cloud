"use client";

// Flagship: a working multi-cloud architecture canvas. AppFrame shell (sidebar,
// topbar, aurora) wraps a header strip + the React Flow playground. All data mock.
import { Sparkles, MousePointer2, Workflow } from "lucide-react";
import { AppFrame } from "@/components/layout/app-frame";
import { PlaygroundCanvas } from "./canvas";

const HINTS = [
  { icon: MousePointer2, text: "Click or drag a service in to add it" },
  { icon: Workflow, text: "Drag between handles to connect" },
  { icon: Sparkles, text: "Two databases can't wire directly" },
];

export default function PlaygroundPage() {
  return (
    <AppFrame title="Playground">
      {/* Fixed height so the flex-1 canvas fills the viewport instead of collapsing
          to content and leaving dead space below. 3.75rem topbar + 2rem→4rem main pad. */}
      <div className="flex h-[calc(100vh-5.75rem)] min-h-[600px] flex-col gap-4 sm:h-[calc(100vh-6.75rem)] lg:h-[calc(100vh-8.75rem)]">
        <div className="clay flex flex-col gap-3 rounded-2xl px-5 py-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Architecture <span className="text-gradient">Canvas</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Compose a multi-cloud topology. Everything here is a live mock — wire it, break it, redraw it.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:ml-auto">
            {HINTS.map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="clay-inset flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground"
              >
                <Icon className="size-3.5 text-accent-cyan" />
                {text}
              </span>
            ))}
          </div>
        </div>

        <PlaygroundCanvas />
      </div>
    </AppFrame>
  );
}
