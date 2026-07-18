import type { ReactNode } from "react";
import { SettingsNav } from "@/components/app/settings-nav";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <div className="text-mono-caps text-ai">Settings</div>
        <h1 className="mt-2 font-display text-4xl font-semibold">Workspace controls</h1>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <SettingsNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
