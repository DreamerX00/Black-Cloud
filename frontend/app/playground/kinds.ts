// Service "kind" taxonomy — powers the inspector grouping and edge validation.
// A connection between two data stores (database↔database) is invalid; the canvas
// rejects it and fires a toast. Everything else is allowed for this mock playground.
import type { Service } from "@/lib/catalog/nodes";

export type Kind = "compute" | "serverless" | "storage" | "database" | "queue" | "kubernetes" | "cdn";

const KIND_BY_ID: Record<string, Kind> = {
  // aws
  ec2: "compute", s3: "storage", lambda: "serverless", rds: "database",
  dynamodb: "database", eks: "kubernetes", sqs: "queue", cloudfront: "cdn",
  // azure
  vm: "compute", blob: "storage", aci: "compute", cosmos: "database",
  functions: "serverless", aks: "kubernetes", servicebus: "queue", cdn: "cdn",
  // gcp
  gce: "compute", gcs: "storage", run: "serverless", spanner: "database",
  bigquery: "database", gke: "kubernetes", pubsub: "queue",
};

export function kindOf(svc: Pick<Service, "id">): Kind {
  return KIND_BY_ID[svc.id] ?? "compute";
}

export const KIND_LABEL: Record<Kind, string> = {
  compute: "Compute",
  serverless: "Serverless",
  storage: "Storage",
  database: "Database",
  queue: "Messaging",
  kubernetes: "Kubernetes",
  cdn: "Edge / CDN",
};

/** Returns a reason string if the edge is invalid, or null if allowed. */
export function invalidEdgeReason(source: Kind, target: Kind): string | null {
  if (source === "database" && target === "database") {
    return "Two databases can't talk directly — put a service or queue between them.";
  }
  return null;
}
