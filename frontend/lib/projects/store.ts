/**
 * Project persistence — the frontend-facing interface.
 *
 * MVP slice uses localStorage so the full flow (create → build → save → reopen)
 * works without a backend. The FastAPI client will later implement this SAME
 * surface (list/create/get/rename/remove/saveGraph), so UI code is unaffected
 * by the swap. API-first boundary (ARCHITECTURE.md).
 *
 * ponytail: localStorage over a mock server — real persistence, zero deps,
 * survives reload. Replace with the API client when the backend loop lands.
 */
import type { GraphSnapshot } from "@/types/graph";

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  graph: GraphSnapshot;
}

const KEY = "blackcloud.projects";

function readAll(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Project[];
  } catch {
    return [];
  }
}

// ── Subscription layer so React can read this via useSyncExternalStore ──
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Cached snapshot — useSyncExternalStore requires a stable reference between
 *  emits (returning a fresh array every call causes an infinite render loop). */
let snapshotCache: Project[] = [];
let snapshotDirty = true;

function writeAll(projects: Project[]) {
  localStorage.setItem(KEY, JSON.stringify(projects));
  snapshotDirty = true;
  emit();
}

export function subscribeProjects(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Stable, sorted snapshot for the client. Recomputed only after a write. */
export function getProjectsSnapshot(): Project[] {
  if (snapshotDirty) {
    snapshotCache = readAll().sort((a, b) => b.updatedAt - a.updatedAt);
    snapshotDirty = false;
  }
  return snapshotCache;
}

/** SSR snapshot — no localStorage on the server, so start empty. */
const EMPTY: Project[] = [];
export function getProjectsServerSnapshot(): Project[] {
  return EMPTY;
}

const uid = () => `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

export const projectStore = {
  get(id: string): Project | undefined {
    return readAll().find((p) => p.id === id);
  },

  create(name: string): Project {
    const now = Date.now();
    const project: Project = {
      id: uid(),
      name: name.trim() || "Untitled project",
      createdAt: now,
      updatedAt: now,
      graph: { nodes: [], edges: [] },
    };
    writeAll([project, ...readAll()]);
    return project;
  },

  rename(id: string, name: string) {
    writeAll(
      readAll().map((p) =>
        p.id === id ? { ...p, name: name.trim() || p.name, updatedAt: Date.now() } : p,
      ),
    );
  },

  remove(id: string) {
    writeAll(readAll().filter((p) => p.id !== id));
  },

  saveGraph(id: string, graph: GraphSnapshot) {
    writeAll(
      readAll().map((p) => (p.id === id ? { ...p, graph, updatedAt: Date.now() } : p)),
    );
  },
};
