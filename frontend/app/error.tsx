"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

// Next 16 renamed `reset` → `unstable_retry` on the error boundary.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // ponytail: no telemetry sink wired yet — console until Sentry/PostHog lands
    console.error("[BlackCloud error]", error);
  }, [error]);

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 nebula opacity-40" />
      <div className="relative w-full max-w-2xl">
        <ClayCard variant="lg" glow="danger" className="p-10 text-center">
          <div className="clay-sm mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl text-danger">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="mt-6 text-mono-caps text-danger">System event</div>
          <h1 className="mt-2 font-display text-4xl font-semibold">Something drifted off-axis.</h1>
          <p className="mx-auto mt-4 max-w-lg text-ink-dim">
            The Council caught the exception and stabilized the graph. You can retry the last action,
            or return to a known-safe surface.
          </p>
          {error.digest && (
            <div className="mt-4 inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-ink-mute">
              digest · {error.digest}
            </div>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <PillButton onClick={() => unstable_retry()} icon={<RotateCcw className="h-4 w-4" />}>
              Retry
            </PillButton>
            <Link href="/dashboard">
              <PillButton variant="ghost" icon={<Home className="h-4 w-4" />}>Home</PillButton>
            </Link>
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
