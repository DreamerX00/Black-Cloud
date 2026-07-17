"use client";

import { Button } from "@/components/ui/button";

/**
 * Google OAuth entry. Disabled until backend `/auth/google` ships; kept in
 * the flow so the layout doesn't shift when we re-enable it. Rendered in
 * claymorphic mode so it matches the surrounding panel language.
 */
export function GoogleOAuthButton() {
  return (
    <Button
      type="button"
      variant="clay"
      size="lg"
      className="w-full justify-center gap-3"
      disabled
      aria-disabled
      title="Coming soon — backend integration pending"
    >
      <GoogleGlyph />
      Continue with Google
      <span className="ml-auto text-[10px] font-mono uppercase tracking-widest text-ink-dim">
        soon
      </span>
    </Button>
  );
}

function GoogleGlyph() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C33.6 6 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3 0 5.8 1.1 8 3l5.7-5.7C33.6 6 29 4 24 4 16 4 9.2 8.5 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5l-6-4.9c-1.9 1.3-4.3 2-6.9 2-5.2 0-9.6-3.3-11.2-8l-6.6 5C9 39.6 15.9 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6 4.9C40 33.8 44 29.4 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
