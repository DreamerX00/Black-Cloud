import type { ReactNode } from "react";
import { SettingsSidebar } from "@/features/settings/settings-sidebar";
import { FadeInUp } from "@/components/motion/primitives";
import { ClayBadge } from "@/components/ui/clay";
import { Settings as SettingsIcon } from "@/components/icons";

/**
 * Settings shell — provides the sticky claymorphic sidebar and a container
 * for the settings surface. Every page below just renders its own content.
 */
export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 tablet:px-8 tablet:py-14">
      <FadeInUp className="space-y-3 mb-8">
        <ClayBadge tone="default">
          <SettingsIcon className="size-3" /> Settings
        </ClayBadge>
        <h1 className="font-display text-4xl font-semibold tracking-tight leading-[0.95] tablet:text-5xl">
          Tune your <span className="italic text-gradient-provider">workspace</span>
        </h1>
        <p className="text-sm text-ink-muted max-w-xl">
          Profile, billing, API access, and how you&apos;re notified — all in one place.
        </p>
      </FadeInUp>

      <div className="grid gap-8 tablet:grid-cols-[240px_1fr]">
        <SettingsSidebar />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
