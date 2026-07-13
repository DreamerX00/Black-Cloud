/**
 * Canvas state (Zustand). Holds the graph in React Flow's own shapes so the
 * <ReactFlow> component binds directly with no translation layer.
 *
 * History model: we snapshot {nodes, edges} onto an undo stack BEFORE any
 * structural mutation (add/delete/duplicate/connect/rename). Continuous drags
 * are NOT snapshotted per-frame — see commitInteraction() for why.
 */
import { create } from "zustand";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";
import type { CloudNode, CloudEdge, GraphSnapshot } from "@/types/graph";
import { getService, type ServiceId } from "@/lib/catalog/nodes";

let nodeSeq = 0;
const newNodeId = () => `n${++nodeSeq}_${Date.now().toString(36)}`;

interface CanvasState {
  nodes: CloudNode[];
  edges: CloudEdge[];
  past: GraphSnapshot[];
  future: GraphSnapshot[];

  // React Flow change handlers
  onNodesChange: (changes: NodeChange<CloudNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<CloudEdge>[]) => void;
  onConnect: (conn: Connection) => void;

  // Structural ops (each pushes history)
  addNode: (serviceId: ServiceId, position: { x: number; y: number }) => void;
  duplicateNode: (id: string) => void;
  deleteNode: (id: string) => void;
  renameNode: (id: string, name: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  /** Snapshot current graph so the NEXT drag/resize can be undone as one step. */
  commitInteraction: () => void;

  // Persistence
  load: (snapshot: GraphSnapshot) => void;
  snapshot: () => GraphSnapshot;
}

const HISTORY_LIMIT = 100;

export const useCanvasStore = create<CanvasState>((set, get) => {
  // Push the current graph onto the undo stack and clear redo.
  const pushHistory = () =>
    set((s) => ({
      past: [...s.past, { nodes: s.nodes, edges: s.edges }].slice(-HISTORY_LIMIT),
      future: [],
    }));

  return {
    nodes: [],
    edges: [],
    past: [],
    future: [],

    onNodesChange: (changes) =>
      set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) })),

    onEdgesChange: (changes) =>
      set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),

    onConnect: (conn) => {
      pushHistory();
      set((s) => ({ edges: addEdge({ ...conn }, s.edges) }));
    },

    addNode: (serviceId, position) => {
      const svc = getService(serviceId);
      if (!svc) return;
      pushHistory();
      const node: CloudNode = {
        id: newNodeId(),
        type: "cloud",
        position,
        data: { serviceId, name: svc.label, tags: [] },
      };
      set((s) => ({ nodes: [...s.nodes, node] }));
    },

    duplicateNode: (id) => {
      const src = get().nodes.find((n) => n.id === id);
      if (!src) return;
      pushHistory();
      const copy: CloudNode = {
        ...src,
        id: newNodeId(),
        position: { x: src.position.x + 32, y: src.position.y + 32 },
        selected: false,
        data: { ...src.data, name: `${src.data.name} copy` },
      };
      set((s) => ({ nodes: [...s.nodes, copy] }));
    },

    deleteNode: (id) => {
      pushHistory();
      set((s) => ({
        nodes: s.nodes.filter((n) => n.id !== id),
        edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      }));
    },

    renameNode: (id, name) => {
      pushHistory();
      set((s) => ({
        nodes: s.nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, name } } : n,
        ),
      }));
    },

    commitInteraction: () => pushHistory(),

    undo: () =>
      set((s) => {
        const prev = s.past.at(-1);
        if (!prev) return s;
        return {
          past: s.past.slice(0, -1),
          future: [{ nodes: s.nodes, edges: s.edges }, ...s.future].slice(0, HISTORY_LIMIT),
          nodes: prev.nodes,
          edges: prev.edges,
        };
      }),

    redo: () =>
      set((s) => {
        const next = s.future[0];
        if (!next) return s;
        return {
          future: s.future.slice(1),
          past: [...s.past, { nodes: s.nodes, edges: s.edges }].slice(-HISTORY_LIMIT),
          nodes: next.nodes,
          edges: next.edges,
        };
      }),

    load: (snapshot) =>
      set({ nodes: snapshot.nodes, edges: snapshot.edges, past: [], future: [] }),

    snapshot: () => ({ nodes: get().nodes, edges: get().edges }),
  };
});
