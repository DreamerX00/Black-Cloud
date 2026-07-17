"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Home, Compass } from "lucide-react";
import { Magnetic } from "@/components/effects/magnetic";
import { ShimmerButton } from "@/components/effects/shimmer-button";
import { Button } from "@/components/ui/button";

// Reuse the login "drifting void" scene — a lost page over an empty starfield.
const VoidScene = dynamic(() => import("./login/scene"), { ssr: false });

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      <VoidScene />
      <div className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <p className="clay-inset rounded-full px-4 py-1.5 text-sm font-medium tracking-widest text-muted-foreground">
          404 — LOST IN THE VOID
        </p>
        <h1 className="max-w-2xl text-balance text-5xl font-semibold sm:text-6xl">
          This corner of the universe
          <br />
          doesn&apos;t exist yet.
        </h1>
        <p className="max-w-md text-muted-foreground">
          The page drifted out of orbit. Let&apos;s navigate you back to
          familiar space.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <Link href="/">
              <ShimmerButton>
                <span className="inline-flex items-center gap-2">
                  <Home className="h-4 w-4" aria-hidden />
                  Back home
                </span>
              </ShimmerButton>
            </Link>
          </Magnetic>
          <Button asChild size="lg" variant="outline" className="h-11 px-6 text-base">
            <Link href="/product">
              <span className="inline-flex items-center gap-2">
                <Compass className="h-4 w-4" aria-hidden />
                Explore the platform
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
