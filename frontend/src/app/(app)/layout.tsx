import type { ReactNode } from "react";
import { AuthGuard } from "@/features/app-shell/auth-guard";
import { TopNav } from "@/features/app-shell/top-nav";

/**
 * Authenticated app shell. Anything under `(app)/` gets nav + auth guard.
 * Playground uses this layout too — it hides its own chrome as needed.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <TopNav />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </AuthGuard>
  );
}
