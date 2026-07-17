import type { Metadata } from "next";
import { PROVIDER_META } from "@/lib/nodes/registry";
import { FadeInUp } from "@/components/motion/primitives";
import { CreateProjectDialog } from "@/features/dashboard/create-project-dialog";
import { ProjectGrid } from "@/features/dashboard/project-grid";
import { ClayBadge, ClayDivider } from "@/components/ui/clay";
import { Sparkles, ProviderMark } from "@/components/icons";

export const metadata: Metadata = { title: "Projects" };

/**
 * Dashboard — landing page for authenticated users.
 * Server Component; client data fetching lives in <ProjectGrid />.
 *
 * The header is a claymorphic hero strip — the user's name of the
 * spaceport. Provider counts glow with each provider's brand color so
 * the eye reads at a glance: "AWS 13 · Azure 5 · GCP 5" as three lit
 * badges, not a comma-separated line of text.
 */
export default function DashboardPage() {
  return (
    <FadeInUp className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 tablet:px-8 tablet:py-14">
        {/* Header strip */}
        <div className="flex flex-col items-start justify-between gap-6 tablet:flex-row tablet:items-end">
          <div className="space-y-3">
            <ClayBadge tone="ai" pulse>
              <Sparkles className="size-3" /> Your workspace
            </ClayBadge>
            <h1 className="font-display text-4xl font-semibold tracking-tight leading-[0.95] tablet:text-5xl">
              Your <span className="italic text-gradient-provider">projects</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {(["aws", "azure", "gcp"] as const).map((p) => (
                <ClayBadge key={p} tone={p}>
                  <ProviderMark provider={p} className="size-3" />
                  {PROVIDER_META[p].label} · {PROVIDER_META[p].count}
                </ClayBadge>
              ))}
              <span className="text-xs text-ink-dim font-mono uppercase tracking-widest">
                services available
              </span>
            </div>
          </div>
          <CreateProjectDialog />
        </div>

        <ClayDivider className="my-8" />

        {/* Grid */}
        <div className="flex-1">
          <ProjectGrid />
        </div>
      </div>
    </FadeInUp>
  );
}
