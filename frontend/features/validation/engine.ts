/**
 * Architecture validation engine (MVP).
 *
 * Pure function of the graph so it runs identically on client (instant edge
 * coloring) and — later — on the server (authoritative check). No React, no store.
 *
 * Source of behavior: plan/MVP.md § Architecture Validation Engine.
 *   Example: ALB → RDS is invalid; suggest ALB → ECS → RDS.
 */
import type { CloudNode, CloudEdge } from "@/types/graph";
import { getService, type ServiceCategory } from "@/lib/catalog/nodes";

export type Severity = "error" | "warning";

export interface Issue {
  edgeId: string;
  severity: Severity;
  message: string;
  suggestion?: string;
}

/**
 * A directed rule between two service categories. If an edge connects a source
 * of `from` category to a target of `to` category, it produces this issue.
 *
 * ponytail: category-pair rules cover the MVP examples with far fewer entries
 * than service-pair rules. Add finer, service-specific rules only when a real
 * case needs them.
 */
interface CategoryRule {
  from: ServiceCategory;
  to: ServiceCategory;
  severity: Severity;
  message: string;
  suggestion?: string;
}

/**
 * MVP rule set — curated edge-pair rules (no subnet/traversal rules yet; those
 * need node config the MVP node doesn't model).
 *
 * The load-balancer → database rules are the canonical MVP example: a database
 * should never sit directly behind a load balancer — a compute tier belongs
 * between them.
 */
const RULES: CategoryRule[] = [
  {
    from: "networking", // ALB / NLB (load balancers live in networking category)
    to: "database",
    severity: "error",
    message: "A load balancer should not connect directly to a database.",
    suggestion: "Insert a compute tier (e.g. ECS or EC2) between them: LB → ECS → DB.",
  },
  {
    from: "cdn", // CloudFront
    to: "database",
    severity: "error",
    message: "A CDN cannot serve a database directly.",
    suggestion: "Point the CDN at an origin (e.g. S3 or a load balancer), not the database.",
  },
  {
    from: "dns", // Route 53
    to: "database",
    severity: "error",
    message: "DNS should not resolve directly to a database.",
    suggestion: "Route DNS to a public entry point (load balancer or CDN) instead.",
  },
  {
    from: "storage", // S3 / Blob / Cloud Storage
    to: "compute",
    severity: "warning",
    message: "Storage rarely initiates a connection to compute.",
    suggestion: "Dependencies usually flow compute → storage. Consider reversing this edge.",
  },
  {
    from: "cdn",
    to: "compute",
    severity: "warning",
    message: "A CDN typically fronts a load balancer, not compute directly.",
    suggestion: "Place a load balancer between the CDN and compute for scaling and health checks.",
  },
];

/** Compute issues for every edge. Returned as a Map keyed by edge id. */
export function validateGraph(
  nodes: CloudNode[],
  edges: CloudEdge[],
): Map<string, Issue> {
  const catOf = (nodeId: string): ServiceCategory | undefined => {
    const n = nodes.find((x) => x.id === nodeId);
    return n ? getService(n.data.serviceId)?.category : undefined;
  };

  const issues = new Map<string, Issue>();
  for (const edge of edges) {
    const from = catOf(edge.source);
    const to = catOf(edge.target);
    if (!from || !to) continue;

    const rule = RULES.find((r) => r.from === from && r.to === to);
    if (rule) {
      issues.set(edge.id, {
        edgeId: edge.id,
        severity: rule.severity,
        message: rule.message,
        suggestion: rule.suggestion,
      });
    }
  }
  return issues;
}
