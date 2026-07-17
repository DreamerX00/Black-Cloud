"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Compass, ArrowLeft } from "@/components/icons";

import { getProject, saveProjectGraph } from "@/services/projects";
import { NODE_BY_ID } from "@/lib/nodes/registry";
import { useAuth } from "@/store/auth";
import { useCanvas } from "@/store/canvas";
import { useMinBreakpoint } from "@/hooks/use-breakpoint";
import { Button } from "@/components/ui/button";
import { ClayPanel, ClayOrb, ClayBadge } from "@/components/ui/clay";

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
    if (!hydrated) return;
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
      <div className="relative grid flex-1 place-items-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-40" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <ClayOrb size="lg" tone="ai" className="animate-[float-y_4s_ease-in-out_infinite]">
            <Compass className="size-8 animate-spin" style={{ animationDuration: "6s" }} />
          </ClayOrb>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-ink-dim">
            <Loader2 className="size-3 animate-spin" />
            <span>Warping into project…</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="relative grid flex-1 place-items-center overflow-hidden px-6">
        <div aria-hidden className="pointer-events-none absolute inset-0 nebula opacity-40" />
        <ClayPanel elevation={3} tone="raised" className="relative z-10 flex max-w-md flex-col items-center gap-4 p-8 text-center">
          <ClayBadge tone="default">404 · Lost in space</ClayBadge>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Project not found
          </h1>
          <p className="text-sm text-ink-muted">
            It may have been deleted, or the link is incorrect.
          </p>
          <Button variant="clay-primary" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="size-4" /> Back to dashboard
          </Button>
        </ClayPanel>
      </div>
    );
  }

  // Mobile: read-only overview per MVP.md §Responsive Design.
  if (!isTabletUp) {
    return (
      <div className="mx-auto flex flex-1 flex-col gap-4 px-4 py-6">
        <ClayPanel elevation={2} tone="raised" className="p-6 text-center space-y-3">
          <ClayBadge tone="ai" pulse>
            Read-only preview
          </ClayBadge>
          <h1 className="font-display text-xl font-semibold">{project.name}</h1>
          <p className="text-sm text-ink-muted">
            {project.nodeCount} node{project.nodeCount !== 1 && "s"} ·{" "}
            {project.edgeCount} connection{project.edgeCount !== 1 && "s"}
          </p>
          <p className="mt-2 text-sm text-ink-dim leading-relaxed">
            Full editing is available on tablet and desktop. Rotate your device
            or switch to a larger screen to sculpt this architecture.
          </p>
        </ClayPanel>
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] w-full bg-[--bc-void]">
      {/* Ambient galaxy behind the canvas */}
      <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-30" />

      <NodePalette />

      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center">
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
