import type { Metadata } from "next";
import { PROVIDER_META } from "@/lib/nodes/registry";
import { FadeInUp } from "@/components/motion/primitives";
import { CreateProjectDialog } from "@/features/dashboard/create-project-dialog";
import { ProjectGrid } from "@/features/dashboard/project-grid";

export const metadata: Metadata = { title: "Projects" };

/**
 * Dashboard — landing page for authenticated users.
 * Server Component; client-side data fetching lives in <ProjectGrid />.
 */
export default function DashboardPage() {
  const totalNodes =
    PROVIDER_META.aws.count + PROVIDER_META.azure.count + PROVIDER_META.gcp.count;

  return (
    <FadeInUp className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 tablet:px-8">
        <div className="flex flex-col items-start justify-between gap-4 tablet:flex-row tablet:items-end">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              Your projects
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {totalNodes} cloud services across{" "}
              <span className="text-aws">AWS · {PROVIDER_META.aws.count}</span>,{" "}
              <span className="text-azure">Azure · {PROVIDER_META.azure.count}</span>,{" "}
              <span className="text-gcp">GCP · {PROVIDER_META.gcp.count}</span>.
            </p>
          </div>
          <CreateProjectDialog />
        </div>

        <div className="mt-8 flex-1">
          <ProjectGrid />
        </div>
      </div>
    </FadeInUp>
  );
}
