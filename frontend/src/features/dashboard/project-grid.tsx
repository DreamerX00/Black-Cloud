"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LayoutGrid, Loader2, PlayCircle } from "lucide-react";

import { useAuth } from "@/store/auth";
import { listProjects, deleteProject } from "@/services/projects";
import { bootstrapDemo } from "@/services/demo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Stagger, motion } from "@/components/motion/primitives";
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
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  return (
    <Stagger className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
      {data.map((project) => (
        <motion.div
          key={project.id}
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
          }}
        >
          <ProjectCard project={project} onDelete={del.mutate} />
        </motion.div>
      ))}
    </Stagger>
  );
}

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
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-graphite/20 px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-graphite text-muted-foreground">
        <LayoutGrid className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-lg">No projects yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create your first cloud architecture — pick a name, drag services onto the
        canvas, and start designing.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <CreateProjectDialog />
        <Button variant="outline" onClick={seedDemo} disabled={seeding}>
          {seeding ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlayCircle className="mr-2 h-4 w-4" />
          )}
          {seeding ? "Starting demo…" : "Start with a demo"}
        </Button>
      </div>
    </div>
  );
}
