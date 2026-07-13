"use client";

import { login, signup } from "./auth";
import { createProject, listProjects, saveProjectGraph } from "./projects";
import { NODE_BY_ID } from "@/lib/nodes/registry";
import type { Project } from "@/types/project";

/**
 * Demo bootstrap — the one-click path from landing to playground.
 *
 * Idempotent: if the demo user already exists, log in; otherwise sign up.
 * Then ensure at least one project exists, seeded with a canonical
 * three-tier web-app graph so the canvas is not empty on first paint.
 *
 * ponytail: single call site (landing hero); if a second caller appears,
 * memoize by session token to avoid duplicate seeds.
 */

const DEMO_EMAIL = "demo@blackcloud.dev";
const DEMO_PASSWORD = "demo-blackcloud-2026";
const DEMO_NAME = "Demo Architect";

export async function bootstrapDemo(): Promise<{
  userId: string;
  projectId: string;
  token: string;
}> {
  // 1. Sign in, falling back to signup on "user not found".
  let session;
  try {
    session = await login({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
  } catch {
    session = await signup({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      confirmPassword: DEMO_PASSWORD,
      name: DEMO_NAME,
    });
  }

  const userId = session.user.id;

  // 2. Ensure a project exists.
  const existing = await listProjects(userId);
  if (existing.length > 0) {
    return { userId, projectId: existing[0].id, token: session.token };
  }

  const project = await createProject(userId, {
    name: "Three-tier web app",
    description: "Demo · ALB → EC2 → RDS with S3 static assets",
  });

  // 3. Seed the canvas with a canonical topology using real registry IDs.
  const seed = buildSeedGraph();
  await saveProjectGraph(
    userId,
    project.id,
    { nodes: seed.nodes, edges: seed.edges },
    (id) => NODE_BY_ID.get(id)?.provider,
  );

  return { userId, projectId: project.id, token: session.token };
}

function buildSeedGraph(): Pick<Project, "nodes" | "edges"> {
  // ALB (public) → EC2 (private) → RDS (private) + EC2 → S3 (static)
  return {
    nodes: [
      {
        id: "n-alb",
        registryId: "aws.alb",
        position: { x: 80, y: 240 },
        data: { label: "web-alb" },
      },
      {
        id: "n-ec2",
        registryId: "aws.ec2",
        position: { x: 380, y: 160 },
        data: { label: "web-app" },
      },
      {
        id: "n-rds",
        registryId: "aws.rds",
        position: { x: 680, y: 240 },
        data: { label: "primary-db" },
      },
      {
        id: "n-s3",
        registryId: "aws.s3",
        position: { x: 380, y: 400 },
        data: { label: "static-assets" },
      },
    ],
    edges: [
      { id: "e-alb-ec2", source: "n-alb", target: "n-ec2" },
      { id: "e-ec2-rds", source: "n-ec2", target: "n-rds" },
      { id: "e-ec2-s3", source: "n-ec2", target: "n-s3" },
    ],
  };
}
