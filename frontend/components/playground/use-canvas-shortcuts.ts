"use client";

import { useEffect } from "react";
import { useCanvasStore } from "@/store/canvasStore";

/**
 * Global keyboard shortcuts for the canvas (MVP § Canvas Features).
 *   ⌘/Ctrl+Z  undo        ⌘/Ctrl+Shift+Z / Ctrl+Y  redo
 *   Delete/Backspace  delete selected     ⌘/Ctrl+D  duplicate selected
 *
 * Ignores keystrokes while typing in inputs/textareas so renaming isn't hijacked.
 */
export function useCanvasShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (typing) return;

      const mod = e.metaKey || e.ctrlKey;
      const s = useCanvasStore.getState();

      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) s.redo();
        else s.undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        s.redo();
        return;
      }
      if (mod && e.key.toLowerCase() === "d") {
        e.preventDefault();
        const sel = s.nodes.find((n) => n.selected);
        if (sel) s.duplicateNode(sel.id);
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        const selected = s.nodes.filter((n) => n.selected);
        if (selected.length === 0) return;
        e.preventDefault();
        selected.forEach((n) => s.deleteNode(n.id));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
