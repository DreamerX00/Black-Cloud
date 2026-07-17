"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  LayoutGrid,
  Loader2,
  PlayCircle,
  Sparkles,
  Compass,
  Rocket,
} from "@/components/icons";

import { useAuth } from "@/store/auth";
import { listProjects, deleteProject } from "@/services/projects";
import { bootstrapDemo } from "@/services/demo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Stagger, motion } from "@/components/motion/primitives";
import { ClayPanel, ClayOrb, ClayBadge } from "@/components/ui/clay";
import { ProjectCard } from "./project-card";
import { CreateProjectDialog } from "./create-project-dialog";

export function ProjectGrid() {
  const userId = useAuth((s) => s.user?.id);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["projects", userId],
    queryFn: () => listProjects(userId!),
    enabled: !!userId,
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteProject(userId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects", userId] });
      toast.success("Project deleted");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed"),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full rounded-clay" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  return (
    <Stagger className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
      {data.map((project) => (
        <motion.div
          key={project.id}
          variants={{
            hidden: { opacity: 0, y: 12, scale: 0.98 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 320, damping: 28 },
            },
          }}
        >
          <ProjectCard project={project} onDelete={del.mutate} />
        </motion.div>
      ))}
    </Stagger>
  );
}

/**
 * EmptyState — cinematic first-project onboarding.
 *
 * When a user has zero projects, this is the *front door* to the whole
 * product. It should feel like arriving at a spaceport, not a blank
 * "get started" placeholder. Central AI orb, orbiting service badges,
 * two CTAs (create fresh · start with demo).
 */
function EmptyState() {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);

  async function seedDemo() {
    if (seeding) return;
    setSeeding(true);
    try {
      const { projectId } = await bootstrapDemo();
      router.push(`/playground/${projectId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Demo seed failed");
      setSeeding(false);
    }
  }

  return (
    <ClayPanel
      elevation={2}
      tone="raised"
      className="relative overflow-hidden isolate p-12 tablet:p-16"
    >
      {/* Ambient galaxy backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-lines-fine opacity-30"
      />

      <div className="relative z-10 grid gap-12 tablet:grid-cols-[1fr_auto] tablet:items-center">
        <div className="max-w-lg space-y-6">
          <ClayBadge tone="ai" pulse>
            <Sparkles className="size-3" /> Your first architecture awaits
          </ClayBadge>
          <h2 className="font-display text-4xl font-semibold leading-[0.98] tracking-[-0.03em] tablet:text-5xl">
            Start with an <span className="italic text-gradient-provider">idea</span>.
            <br />
            Ship the graph.
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Every project is a canvas. Drag a service, connect it to
            another, and watch cost, security, and resilience update in
            real time. Your first stack takes under 60 seconds.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <CreateProjectDialog size="hero" />
            <Button
              type="button"
              variant="clay-ghost"
              size="hero"
              onClick={seedDemo}
              disabled={seeding}
            >
              {seeding ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Starting demo…
                </>
              ) : (
                <>
                  <PlayCircle className="size-5" /> Start with a demo stack
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-4 text-[10px] font-mono uppercase tracking-widest text-ink-dim">
            <span className="flex items-center gap-1.5">
              <LayoutGrid className="size-3" /> 23 services
            </span>
            <span>·</span>
            <span>60-second first stack</span>
            <span>·</span>
            <span>PNG · SVG · JSON export</span>
          </div>
        </div>

        {/* Constellation — AI core orbited by 3 provider orbs */}
        <div className="relative mx-auto grid place-items-center">
          <div className="relative size-[280px] tablet:size-[320px]">
            <ClayOrb
              size="xl"
              tone="ai"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <Compass className="size-14" />
            </ClayOrb>
            {(["aws", "azure", "gcp"] as const).map((p, i) => (
              <div
                key={p}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateY(-120px) rotate(-${i * 120}deg)`,
                }}
              >
                <ClayOrb size="md" tone={p} className="animate-[float-y_5s_ease-in-out_infinite]">
                  <Rocket className="size-5" />
                </ClayOrb>
              </div>
            ))}
            {/* Orbital rings */}
            {[100, 130, 160].map((r) => (
              <div
                key={r}
                aria-hidden
                className="absolute left-1/2 top-1/2 rounded-full border border-white/[0.04]"
                style={{
                  width: r * 2,
                  height: r * 2,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </ClayPanel>
  );
}
