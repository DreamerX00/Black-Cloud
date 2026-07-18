import type { ReactNode } from "react";
import { GlobalNav } from "./global-nav";
import { GlobalFooter } from "./global-footer";
import { CustomCursor } from "./custom-cursor";
import { AmbientUniverse } from "./ambient-universe";
import { Toaster } from "sonner";
import { ScrollProgress } from "./scroll-progress";
import { CommandPaletteMount } from "./command-palette-mount";

/**
 * Wraps every route. Server component so it stays out of client bundle;
 * interactive bits are individual `use client` islands beneath it.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <AmbientUniverse />
      <CustomCursor />
      <ScrollProgress />
      <GlobalNav />
      <main className="relative z-10 min-h-[100dvh]">{children}</main>
      <GlobalFooter />
      <CommandPaletteMount />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(11,15,23,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#e6edf7",
            backdropFilter: "blur(20px)",
          },
        }}
      />
    </>
  );
}
