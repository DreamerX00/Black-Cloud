"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import type { ReactNode } from "react";

/**
 * Client-side auth gate.
 * ponytail: MVP session lives in localStorage; a server-side guard would
 * need a real backend session cookie. When the FastAPI lands with an
 * httpOnly session, this becomes a Server Component middleware check.
 * Rendering nothing during hydration + redirect avoids the flash-of-content.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, hydrated, hydrate } = useAuth();

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    // Skeleton hydration frame — same background as authenticated shell so
    // there's no visible flash. Not a spinner; canvas apps flicker enough.
    return <div className="min-h-screen bg-background" aria-hidden />;
  }

  return <>{children}</>;
}
