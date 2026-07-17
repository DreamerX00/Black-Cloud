// Deterministic mock data for the app shells. No Math.random()/Date.now() — all
// values are literals so SSR and client render identically (no hydration drift).
import type { Provider } from "@/lib/catalog/nodes";

export interface Project {
  id: string;
  name: string;
  provider: Provider | "multi";
  nodes: number;
  edges: number;
  status: "healthy" | "degraded" | "draft";
  updated: string;
  cost: number; // $/mo
}

export const PROJECTS: Project[] = [
  { id: "p1", name: "Aurora Payments", provider: "aws", nodes: 24, edges: 41, status: "healthy", updated: "2h ago", cost: 4820 },
  { id: "p2", name: "Nimbus Analytics", provider: "gcp", nodes: 18, edges: 29, status: "degraded", updated: "6h ago", cost: 3110 },
  { id: "p3", name: "Vault Identity", provider: "azure", nodes: 12, edges: 17, status: "healthy", updated: "1d ago", cost: 1980 },
  { id: "p4", name: "Helios Edge CDN", provider: "multi", nodes: 33, edges: 58, status: "healthy", updated: "2d ago", cost: 7640 },
  { id: "p5", name: "Orbit Staging", provider: "aws", nodes: 9, edges: 11, status: "draft", updated: "3d ago", cost: 420 },
  { id: "p6", name: "Cinder Data Lake", provider: "gcp", nodes: 27, edges: 44, status: "healthy", updated: "4d ago", cost: 5290 },
];

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  delta: number; // percent
}

export const STATS: Stat[] = [
  { label: "Active projects", value: 6, delta: 12 },
  { label: "Monthly spend", value: 23260, prefix: "$", delta: -4 },
  { label: "Deploys this week", value: 148, delta: 22 },
  { label: "Uptime", value: 99.98, suffix: "%", delta: 0.1 },
];

export interface Activity {
  id: string;
  who: string;
  action: string;
  target: string;
  when: string;
  kind: "deploy" | "edit" | "alert" | "migrate";
}

export const ACTIVITY: Activity[] = [
  { id: "a1", who: "Priya N.", action: "deployed", target: "Aurora Payments", when: "2h ago", kind: "deploy" },
  { id: "a2", who: "Simulator", action: "flagged AZ failure risk on", target: "Nimbus Analytics", when: "6h ago", kind: "alert" },
  { id: "a3", who: "Marcus F.", action: "migrated", target: "Vault Identity → Azure", when: "1d ago", kind: "migrate" },
  { id: "a4", who: "AI Architect", action: "generated blueprint for", target: "Helios Edge CDN", when: "2d ago", kind: "edit" },
  { id: "a5", who: "Sofia A.", action: "rolled back", target: "Orbit Staging", when: "3d ago", kind: "deploy" },
];

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  tag: "feature" | "fix" | "perf";
  points: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v2.4.0",
    date: "July 14, 2026",
    title: "Time Machine goes multi-cloud",
    tag: "feature",
    points: ["Snapshot diffing across providers", "Rewind slider now scrubs at 60fps", "Ghost-render of prior topology"],
  },
  {
    version: "v2.3.1",
    date: "July 2, 2026",
    title: "Faster canvas at scale",
    tag: "perf",
    points: ["300+ node graphs render 2.4× faster", "PixiJS traffic layer memory halved"],
  },
  {
    version: "v2.3.0",
    date: "June 20, 2026",
    title: "AI Architect v2",
    tag: "feature",
    points: ["Prompt-to-architecture with cost projection", "Inline Terraform export", "Security review pass"],
  },
  {
    version: "v2.2.4",
    date: "June 8, 2026",
    title: "Migration morph fixes",
    tag: "fix",
    points: ["Correct Lambda → Cloud Run mapping", "Edge validation no longer flickers"],
  },
];

export interface Snapshot {
  id: string;
  label: string;
  date: string;
  nodes: number;
  note: string;
}

export const SNAPSHOTS: Snapshot[] = [
  { id: "s1", label: "Genesis", date: "Mar 2026", nodes: 6, note: "Initial single-VPC design." },
  { id: "s2", label: "HA rollout", date: "Apr 2026", nodes: 14, note: "Added multi-AZ + read replicas." },
  { id: "s3", label: "Edge era", date: "May 2026", nodes: 22, note: "CloudFront + global cache introduced." },
  { id: "s4", label: "Current", date: "Jul 2026", nodes: 24, note: "Payments isolation + WAF." },
];

// Migration compatibility mapping: source service → target service label + risk.
export interface MigrationMap {
  from: string;
  to: string;
  risk: "low" | "medium" | "high";
}

export const MIGRATION_MAP: MigrationMap[] = [
  { from: "EC2", to: "Compute Engine", risk: "low" },
  { from: "Lambda", to: "Cloud Run", risk: "medium" },
  { from: "S3", to: "Cloud Storage", risk: "low" },
  { from: "DynamoDB", to: "Firestore", risk: "high" },
  { from: "RDS", to: "Cloud SQL", risk: "medium" },
  { from: "CloudFront", to: "Cloud CDN", risk: "low" },
];
