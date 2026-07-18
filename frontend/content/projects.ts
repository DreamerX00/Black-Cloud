export type Project = {
  id: string;
  name: string;
  provider: "aws" | "azure" | "gcp" | "multi";
  environment: "prod" | "staging" | "dev";
  health: number; // 0-100
  cost: number; // monthly USD
  nodes: number;
  edges: number;
  updated: string; // ISO date
  activity: number[]; // 14-day count
  owner: string;
  status: "live" | "review" | "draft" | "chaos";
};

export const PROJECTS: Project[] = [
  {
    id: "orion",
    name: "Orion — customer platform",
    provider: "aws",
    environment: "prod",
    health: 92,
    cost: 18420,
    nodes: 47,
    edges: 78,
    updated: "2026-07-17",
    activity: [3, 4, 2, 5, 8, 6, 4, 7, 12, 9, 5, 3, 6, 8],
    owner: "Akash Singh",
    status: "live",
  },
  {
    id: "andromeda",
    name: "Andromeda — analytics pipeline",
    provider: "multi",
    environment: "prod",
    health: 78,
    cost: 9340,
    nodes: 32,
    edges: 51,
    updated: "2026-07-16",
    activity: [2, 3, 2, 4, 3, 5, 4, 6, 5, 3, 4, 5, 7, 4],
    owner: "Priyanka R.",
    status: "review",
  },
  {
    id: "callisto",
    name: "Callisto — HIPAA patient portal",
    provider: "azure",
    environment: "prod",
    health: 88,
    cost: 22110,
    nodes: 58,
    edges: 94,
    updated: "2026-07-15",
    activity: [1, 2, 1, 3, 4, 5, 6, 4, 3, 2, 4, 5, 6, 3],
    owner: "Marcus O.",
    status: "live",
  },
  {
    id: "vega",
    name: "Vega — internal tools",
    provider: "gcp",
    environment: "staging",
    health: 71,
    cost: 3210,
    nodes: 19,
    edges: 26,
    updated: "2026-07-14",
    activity: [0, 1, 2, 1, 3, 1, 2, 0, 4, 3, 2, 1, 3, 2],
    owner: "Lena F.",
    status: "draft",
  },
  {
    id: "sirius",
    name: "Sirius — payment ledger",
    provider: "aws",
    environment: "prod",
    health: 95,
    cost: 12040,
    nodes: 41,
    edges: 66,
    updated: "2026-07-12",
    activity: [4, 3, 6, 4, 5, 8, 6, 7, 9, 5, 4, 6, 8, 7],
    owner: "Ade K.",
    status: "chaos",
  },
  {
    id: "polaris",
    name: "Polaris — data lake",
    provider: "multi",
    environment: "dev",
    health: 64,
    cost: 5820,
    nodes: 27,
    edges: 44,
    updated: "2026-07-10",
    activity: [1, 2, 0, 3, 2, 1, 4, 3, 2, 1, 4, 5, 3, 2],
    owner: "Rin T.",
    status: "review",
  },
];

export function getProject(id: string) {
  return PROJECTS.find(p => p.id === id);
}

export function getProjectIds() {
  return PROJECTS.map(p => p.id);
}
