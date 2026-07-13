"use client";

import { create } from "zustand";
import {
  applyEdgeChanges,
  applyNodeChanges,
  addEdge as rfAddEdge,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import { NODE_BY_ID } from "@/lib/nodes/registry";
import type { CanvasEdge, CanvasNode } from "@/types/project";

/**
 * Canvas store — single source of truth for the React Flow graph.
 *
 * ── Performance discipline (targets: 100 nodes / 200 edges @ 60fps) ─────────
 * 1. State is FLAT: `nodes[]`, `edges[]`. No derived arrays live in state.
 *    Selectors compute on read; React Flow already diffs by identity.
 * 2. Every mutating action produces a NEW top-level reference (spread/replace),
 *    so shallow-equal selectors bail out early when unrelated slices change.
 * 3. Undo/redo is a bounded ring buffer (default 50 steps) — undo of undo
 *    is *not* linear; it's O(1) index moves against the same buffer.
 * 4. Callers MUST use targeted selectors, e.g. `useCanvas(s => s.nodes)`.
 *    Never `useCanvas()` unfiltered — that resubs on every keystroke.
 */

// React Flow expects loose `data` on nodes; we still tag them with our
// registryId so custom components + validation can look up definitions fast.
export type RFNode = Node<{
  registryId: string;
  label: string;
  notes?: string;
}>;
export type RFEdge = Edge;

interface Snapshot {
  nodes: RFNode[];
  edges: RFEdge[];
}

interface CanvasState {
  nodes: RFNode[];
  edges: RFEdge[];
  /** True after `hydrate()` — components can gate render on this. */
  hydrated: boolean;

  // History
  past: Snapshot[];
  future: Snapshot[];

  // ── Read-only queries (do not use in useCanvas selectors — call directly)
  canUndo: () => boolean;
  canRedo: () => boolean;

  // ── Mutations
  hydrate: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  reset: () => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (conn: Connection) => void;
  addNodeFromRegistry: (registryId: string, position: { x: number; y: number }) => void;
  removeSelected: () => void;
  renameNode: (id: string, label: string) => void;

  undo: () => void;
  redo: () => void;
}

const HISTORY_LIMIT = 50;

// Snapshots are shallow — nodes/edges are frozen arrays we already reference.
function snapshot(state: Pick<CanvasState, "nodes" | "edges">): Snapshot {
  return { nodes: state.nodes, edges: state.edges };
}

function pushHistory(past: Snapshot[], snap: Snapshot): Snapshot[] {
  const next = past.length >= HISTORY_LIMIT ? past.slice(1) : past.slice();
  next.push(snap);
  return next;
}

function toRFNode(n: CanvasNode): RFNode {
  return {
    id: n.id,
    type: "cloud", // custom node type registered in the canvas component
    position: n.position,
    data: { registryId: n.registryId, label: n.data.label, notes: n.data.notes },
  };
}

function toRFEdge(e: CanvasEdge): RFEdge {
  return { id: e.id, source: e.source, target: e.target, label: e.label };
}

export const useCanvas = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  hydrated: false,
  past: [],
  future: [],

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  hydrate: (nodes, edges) =>
    set({
      nodes: nodes.map(toRFNode),
      edges: edges.map(toRFEdge),
      past: [],
      future: [],
      hydrated: true,
    }),

  reset: () => set({ nodes: [], edges: [], past: [], future: [], hydrated: false }),

  // Position drag/select/dimension changes are HIGH-frequency (fires per frame
  // during drag). We deliberately DO NOT push history on every change — we
  // snapshot only on discrete actions (add, delete, connect, rename).
  onNodesChange: (changes) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) as RFNode[] })),

  onEdgesChange: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),

  onConnect: (conn) =>
    set((s) => ({
      past: pushHistory(s.past, snapshot(s)),
      future: [],
      edges: rfAddEdge(
        { ...conn, id: crypto.randomUUID(), animated: true },
        s.edges,
      ),
    })),

  addNodeFromRegistry: (registryId, position) => {
    const def = NODE_BY_ID.get(registryId);
    if (!def) return;
    set((s) => ({
      past: pushHistory(s.past, snapshot(s)),
      future: [],
      nodes: [
        ...s.nodes,
        {
          id: crypto.randomUUID(),
          type: "cloud",
          position,
          data: { registryId, label: def.label },
        },
      ],
    }));
  },

  removeSelected: () =>
    set((s) => {
      const nodesLeft = s.nodes.filter((n) => !n.selected);
      const removedIds = new Set(
        s.nodes.filter((n) => n.selected).map((n) => n.id),
      );
      if (nodesLeft.length === s.nodes.length && !s.edges.some((e) => e.selected))
        return {};
      const edgesLeft = s.edges.filter(
        (e) => !e.selected && !removedIds.has(e.source) && !removedIds.has(e.target),
      );
      return {
        past: pushHistory(s.past, snapshot(s)),
        future: [],
        nodes: nodesLeft,
        edges: edgesLeft,
      };
    }),

  renameNode: (id, label) =>
    set((s) => ({
      past: pushHistory(s.past, snapshot(s)),
      future: [],
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label } } : n,
      ),
    })),

  undo: () =>
    set((s) => {
      if (s.past.length === 0) return {};
      const previous = s.past[s.past.length - 1];
      return {
        past: s.past.slice(0, -1),
        future: [snapshot(s), ...s.future].slice(0, HISTORY_LIMIT),
        nodes: previous.nodes,
        edges: previous.edges,
      };
    }),

  redo: () =>
    set((s) => {
      if (s.future.length === 0) return {};
      const [next, ...rest] = s.future;
      return {
        past: pushHistory(s.past, snapshot(s)),
        future: rest,
        nodes: next.nodes,
        edges: next.edges,
      };
    }),
}));

// ── Selector helpers (import these instead of writing inline lambdas so React
// keeps stable identity across renders — the classic Zustand perf trap). ────
export const selectNodes = (s: CanvasState) => s.nodes;
export const selectEdges = (s: CanvasState) => s.edges;
export const selectOnNodesChange = (s: CanvasState) => s.onNodesChange;
export const selectOnEdgesChange = (s: CanvasState) => s.onEdgesChange;
export const selectOnConnect = (s: CanvasState) => s.onConnect;
export const selectAddNode = (s: CanvasState) => s.addNodeFromRegistry;
export const selectRemoveSelected = (s: CanvasState) => s.removeSelected;
export const selectUndo = (s: CanvasState) => s.undo;
export const selectRedo = (s: CanvasState) => s.redo;
