import type { Project, ProjectId, ProjectSummary } from "@/types/project";

/**
 * Project service — mock implementation, real backend will replace internals.
 * Persists to localStorage per-user so multiple mock accounts stay isolated.
 * All async on purpose so the eventual `fetch` swap is a no-op for callers.
 */

const LS_PREFIX = "bc.projects."; // + userId
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function key(userId: string) {
  return `${LS_PREFIX}${userId}`;
}

function readAll(userId: string): Project[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key(userId)) ?? "[]") as Project[];
  } catch {
    return [];
  }
}

function writeAll(userId: string, projects: Project[]) {
  localStorage.setItem(key(userId), JSON.stringify(projects));
}

function toSummary(p: Project): ProjectSummary {
  // Strip the graph payload — cheaper for the dashboard.
  const {
    id,
    name,
    description,
    createdAt,
    updatedAt,
    providers,
    nodeCount,
    edgeCount,
  } = p;
  return {
    id,
    name,
    description,
    createdAt,
    updatedAt,
    providers,
    nodeCount,
    edgeCount,
  };
}

// ─── Public API ────────────────────────────────────────────────────────────

export async function listProjects(userId: string): Promise<ProjectSummary[]> {
  await sleep(250);
  return readAll(userId)
    .map(toSummary)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProject(
  userId: string,
  id: ProjectId,
): Promise<Project | null> {
  await sleep(200);
  const found = readAll(userId).find((p) => p.id === id);
  return found ?? null;
}

export async function createProject(
  userId: string,
  input: { name: string; description?: string },
): Promise<Project> {
  await sleep(300);
  const now = new Date().toISOString();
  const project: Project = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    description: input.description?.trim() || null,
    createdAt: now,
    updatedAt: now,
    providers: [],
    nodeCount: 0,
    edgeCount: 0,
    nodes: [],
    edges: [],
  };
  writeAll(userId, [project, ...readAll(userId)]);
  return project;
}

export async function renameProject(
  userId: string,
  id: ProjectId,
  name: string,
): Promise<Project> {
  await sleep(200);
  const all = readAll(userId);
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Project not found");
  all[idx] = { ...all[idx], name: name.trim(), updatedAt: new Date().toISOString() };
  writeAll(userId, all);
  return all[idx];
}

export async function deleteProject(userId: string, id: ProjectId): Promise<void> {
  await sleep(200);
  writeAll(userId, readAll(userId).filter((p) => p.id !== id));
}

/**
 * Persist canvas graph changes. Recomputes derived summary fields
 * (providers, nodeCount, edgeCount) from the graph so the dashboard cards
 * stay honest without extra bookkeeping in the caller.
 */
export async function saveProjectGraph(
  userId: string,
  id: ProjectId,
  patch: { nodes: Project["nodes"]; edges: Project["edges"] },
  registryLookup: (registryId: string) => string | undefined,
): Promise<Project> {
  await sleep(200);
  const all = readAll(userId);
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Project not found");

  const providers = Array.from(
    new Set(
      patch.nodes
        .map((n) => registryLookup(n.registryId))
        .filter((p): p is string => Boolean(p)),
    ),
  ) as Project["providers"];

  all[idx] = {
    ...all[idx],
    ...patch,
    providers,
    nodeCount: patch.nodes.length,
    edgeCount: patch.edges.length,
    updatedAt: new Date().toISOString(),
  };
  writeAll(userId, all);
  return all[idx];
}
