"use client";

import { useEffect, useState } from "react";
import { CommandPalette } from "../ui/command-palette";

/**
 * Keeps the palette out of the tree by default. Global `⌘K` or a
 * `blackcloud:open-command` event toggles it in.
 */
export function CommandPaletteMount() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(v => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onEvt = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("blackcloud:open-command", onEvt);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("blackcloud:open-command", onEvt);
    };
  }, []);

  return <CommandPalette open={open} onOpenChange={setOpen} />;
}
