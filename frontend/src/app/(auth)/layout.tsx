import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Auth route group layout.
 * Fluid full-viewport shell: mobile stacks vertically, desktop shows a
 * decorative gradient panel next to the form. No React tree crossing routes —
 * next.js parallel routes are overkill for a two-page flow.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full">
      {/* Ambient background — matches landing */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(66,133,244,0.08),transparent_55%)]"
      />

      <header className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 tablet:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <span aria-hidden className="text-xl">⚫</span>
          BlackCloud
        </Link>
      </header>

      <main className="flex min-h-screen items-center justify-center px-4 py-24 tablet:px-8">
        {children}
      </main>
    </div>
  );
}
