/**
 * Project domain types.
 * A project holds the canvas graph (nodes + edges) plus metadata.
 * Shape mirrors the future FastAPI `Project` resource; see plan/ARCHITECTURE.md
 * §Project Domain.
 */

import type { Provider } from "@/lib/nodes/registry";

export type ProjectId = string;

/** Minimal record used on the dashboard list — no graph payload. */
export interface ProjectSummary {
  id: ProjectId;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  /** Providers present in the graph — quick badge affordance for the card. */
  providers: Provider[];
  /** Cached counts so the list doesn't have to load the full graph. */
  nodeCount: number;
  edgeCount: number;
}

/** Full project payload — includes the canvas graph. */
export interface Project extends ProjectSummary {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

// ── Canvas graph ──────────────────────────────────────────────────────────
// Compatible with React Flow's `Node` / `Edge` shape but strictly typed to our
// registry so a stale nodeId is a type error, not a runtime hole.

export interface CanvasNode {
  id: string;                 // instance id (uuid) — NOT the registry id
  registryId: string;         // → NodeDefinition.id in the registry
  position: { x: number; y: number };
  data: {
    label: string;            // user-editable rename; defaults to registry.label
    notes?: string;
  };
}

export interface CanvasEdge {
  id: string;
  source: string;             // CanvasNode.id
  target: string;             // CanvasNode.id
  label?: string;
}
