"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { getProject, saveProjectGraph } from "@/services/projects";
import { NODE_BY_ID } from "@/lib/nodes/registry";
import { useAuth } from "@/store/auth";
import { useCanvas } from "@/store/canvas";
import { useMinBreakpoint } from "@/hooks/use-breakpoint";

import { Canvas } from "./canvas";
import { NodePalette } from "./node-palette";
import { Inspector } from "./inspector";
import { CanvasToolbar } from "./canvas-toolbar";
import { FpsMeter } from "@/components/perf/fps-meter";
import type { CanvasEdge, CanvasNode } from "@/types/project";

const AUTOSAVE_DEBOUNCE = 800;

interface Props {
  projectId: string;
}

export function PlaygroundShell({ projectId }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const userId = useAuth((s) => s.user?.id);
  const isTabletUp = useMinBreakpoint("tablet");

  // ─── Data load ────────────────────────────────────────────────────────────
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", userId, projectId],
    queryFn: () => getProject(userId!, projectId),
    enabled: !!userId,
  });

  const hydrate = useCanvas((s) => s.hydrate);
  const reset = useCanvas((s) => s.reset);
  const nodes = useCanvas((s) => s.nodes);
  const edges = useCanvas((s) => s.edges);
  const hydrated = useCanvas((s) => s.hydrated);

  // Load graph into the store when project arrives; reset on unmount so a
  // different project doesn't inherit the previous canvas.
  useEffect(() => {
    if (project) hydrate(project.nodes, project.edges);
    return () => reset();
  }, [project, hydrate, reset]);

  // ─── Autosave ────────────────────────────────────────────────────────────
  const saveMut = useMutation({
    mutationFn: (patch: { nodes: CanvasNode[]; edges: CanvasEdge[] }) =>
      saveProjectGraph(userId!, projectId, patch, (id) =>
        NODE_BY_ID.get(id)?.provider,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects", userId] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Save failed"),
  });

  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildPatch = useCallback(
    () => ({
      nodes: nodes.map<CanvasNode>((n) => ({
        id: n.id,
        registryId: n.data.registryId,
        position: n.position,
        data: { label: n.data.label, notes: n.data.notes },
      })),
      edges: edges.map<CanvasEdge>((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: typeof e.label === "string" ? e.label : undefined,
      })),
    }),
    [nodes, edges],
  );

  const manualSave = useCallback(() => {
    saveMut.mutate(buildPatch(), {
      onSuccess: () => setLastSavedAt(new Date().toISOString()),
    });
  }, [saveMut, buildPatch]);

  useEffect(() => {
    if (!hydrated) return; // don't autosave the empty pre-hydrate state
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveMut.mutate(buildPatch(), {
        onSuccess: () => setLastSavedAt(new Date().toISOString()),
      });
    }, AUTOSAVE_DEBOUNCE);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, hydrated]);

  // ─── Render ──────────────────────────────────────────────────────────────
  if (isLoading || !userId) {
    return (
      <div className="grid flex-1 place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="font-display text-2xl">Project not found</h1>
        <p className="text-sm text-muted-foreground">
          It may have been deleted, or the link is incorrect.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  // Mobile: read-only overview per MVP.md §Responsive Design.
  if (!isTabletUp) {
    return (
      <div className="mx-auto flex flex-1 flex-col gap-4 px-4 py-6 text-center">
        <h1 className="font-display text-xl">{project.name}</h1>
        <p className="text-sm text-muted-foreground">
          {project.nodeCount} node{project.nodeCount !== 1 && "s"} ·{" "}
          {project.edgeCount} connection{project.edgeCount !== 1 && "s"}
        </p>
        <p className="mt-6 rounded-lg border border-border/60 bg-graphite/40 p-4 text-sm text-muted-foreground">
          Full editing is available on tablet and desktop. Rotate or switch
          devices to design this architecture.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] w-full">
      <NodePalette />

      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center">
          <CanvasToolbar
            projectName={project.name}
            saving={saveMut.isPending}
            lastSavedAt={lastSavedAt}
            onManualSave={manualSave}
          />
        </div>
        <Canvas />
      </div>

      <Inspector />
      <FpsMeter />
    </div>
  );
}
