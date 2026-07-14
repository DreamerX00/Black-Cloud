"use client";

// DOM overlay outside the R3F Canvas. Two states driven by the shared store:
// cinematic intro screen, and a minimal in-world (roam) HUD.
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useExperience } from "@/components/experience/store";
import { CATALOG } from "@/lib/catalog/nodes";

export function HUD() {
  const mode = useExperience((s) => s.mode);
  const warping = useExperience((s) => s.warping);
  const focusedService = useExperience((s) => s.focusedService);
  const enterWorld = useExperience((s) => s.enterWorld);
  const exitToCinematic = useExperience((s) => s.exitToCinematic);
  const setWarping = useExperience((s) => s.setWarping);

  // Esc leaves free-roam. SSR-safe (window touched only inside effect).
  useEffect(() => {
    if (mode !== "roam") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitToCinematic();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, exitToCinematic]);

  const handleEnter = () => {
    setWarping(true);
    window.setTimeout(() => {
      setWarping(false);
      enterWorld();
    }, 900);
  };

  const handleReturn = () => {
    exitToCinematic();
    document.exitPointerLock?.();
  };

  const focused = focusedService
    ? CATALOG.find((s) => s.id === focusedService)
    : undefined;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 select-none">
      <AnimatePresence mode="wait">
        {mode === "cinematic" ? (
          <motion.div
            key="cinematic"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {/* Skip to site */}
            <a
              href="#site"
              className="pointer-events-auto absolute right-6 top-6 font-mono text-xs uppercase tracking-widest text-fg-muted transition-colors hover:text-fg"
            >
              Skip to site
            </a>

            {/* Centered intro */}
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="max-w-2xl rounded-3xl bg-void/30 px-8 py-10 text-center backdrop-blur">
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
                  An Interactive Universe
                </p>
                <h1 className="mt-4 font-display text-6xl leading-none text-fg sm:text-8xl">
                  BlackCloud
                </h1>
                <p className="mx-auto mt-5 max-w-md text-fg-muted">
                  Your cloud, rendered as a living universe. Scroll to fly
                  through it.
                </p>

                <motion.button
                  type="button"
                  onClick={handleEnter}
                  disabled={warping}
                  animate={{ scale: warping ? 1 : [1, 1.04, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="pointer-events-auto mt-8 rounded-full bg-primary px-8 py-3 font-display text-lg text-void shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-opacity disabled:opacity-60"
                >
                  {warping ? "Entering…" : "Enter the world"}
                </motion.button>
              </div>
            </div>

            {/* Scroll hint */}
            <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-1 text-fg-muted">
              <span className="font-mono text-xs uppercase tracking-widest">
                Scroll to explore
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="roam"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {/* Return to cinematic */}
            <button
              type="button"
              onClick={handleReturn}
              className="pointer-events-auto absolute left-6 top-6 rounded-full border border-border-strong bg-void/40 px-4 py-2 font-mono text-xs uppercase tracking-widest text-fg-muted backdrop-blur transition-colors hover:text-fg"
            >
              Return to cinematic
            </button>

            {/* Crosshair */}
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/80" />

            {/* Focused service card */}
            <AnimatePresence>
              {focused && (
                <motion.div
                  key={focused.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-1/2 top-[58%] w-72 -translate-x-1/2 rounded-xl border border-border-strong bg-void/40 p-4 backdrop-blur"
                >
                  <p className="font-display text-lg text-fg">{focused.label}</p>
                  <p className="mt-1 text-sm text-fg-muted">{focused.blurb}</p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-widest text-primary">
                    Press Space / click to open
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls hint */}
            <div className="absolute inset-x-0 bottom-8 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-fg-muted">
                WASD move · Mouse look · Shift sprint · Esc exit
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
