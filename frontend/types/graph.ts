/**
 * Shared graph types. Mirror the MVP DB entities (Nodes, Edges, SavedLayouts)
 * so the same shapes serialize to the backend later without translation.
 */
import type { Node, Edge } from "@xyflow/react";
import type { ServiceId } from "@/lib/catalog/nodes";

/** Data carried by each canvas node (React Flow keeps position/id/selected itself). */
export interface CloudNodeData {
  /** Which catalog service this node instantiates. */
  serviceId: ServiceId;
  /** User-editable display name (defaults to the service label). */
  name: string;
  /** Free-form tags shown in the inspector (MVP inspector field). */
  tags: string[];
  /** Index signature required by React Flow's Record<string, unknown> data bound. */
  [key: string]: unknown;
}

/** A canvas node: React Flow's Node parameterized with our data + kind. */
export type CloudNode = Node<CloudNodeData, "cloud">;

/** Edges carry no extra data in the MVP (validation status is computed, not stored). */
export type CloudEdge = Edge;

/** Serializable snapshot persisted as a project's SavedLayout. */
export interface GraphSnapshot {
  nodes: CloudNode[];
  edges: CloudEdge[];
}
