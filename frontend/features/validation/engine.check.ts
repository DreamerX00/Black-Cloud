/**
 * Runnable check for the validation engine.
 * Run: bun run features/validation/engine.check.ts
 */
import { validateGraph } from "./engine";
import type { CloudNode, CloudEdge } from "@/types/graph";
import type { ServiceId } from "@/lib/catalog/nodes";

const node = (id: string, serviceId: ServiceId): CloudNode => ({
  id,
  type: "cloud",
  position: { x: 0, y: 0 },
  data: { serviceId, name: id, tags: [] },
});
const edge = (id: string, source: string, target: string): CloudEdge => ({
  id,
  source,
  target,
});

const assert = (cond: boolean, msg: string) => {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
};

// ALB → RDS : the canonical invalid case
{
  const nodes = [node("alb", "aws-alb"), node("rds", "aws-rds")];
  const edges = [edge("e1", "alb", "rds")];
  const issues = validateGraph(nodes, edges);
  assert(issues.get("e1")?.severity === "error", "ALB→RDS should be an error");
  assert(!!issues.get("e1")?.suggestion, "ALB→RDS should suggest a fix");
}

// ALB → ECS → RDS : the valid remediation, no issues
{
  const nodes = [node("alb", "aws-alb"), node("ecs", "aws-ecs"), node("rds", "aws-rds")];
  const edges = [edge("e1", "alb", "ecs"), edge("e2", "ecs", "rds")];
  const issues = validateGraph(nodes, edges);
  assert(issues.size === 0, "ALB→ECS→RDS should be clean");
}

// storage → compute : warning (reversed dependency)
{
  const nodes = [node("s3", "aws-s3"), node("ec2", "aws-ec2")];
  const issues = validateGraph(nodes, [edge("e1", "s3", "ec2")]);
  assert(issues.get("e1")?.severity === "warning", "S3→EC2 should warn");
}

// compute → storage : the normal direction, clean
{
  const nodes = [node("ec2", "aws-ec2"), node("s3", "aws-s3")];
  const issues = validateGraph(nodes, [edge("e1", "ec2", "s3")]);
  assert(issues.size === 0, "EC2→S3 should be clean");
}

// dangling edge (unknown node) is ignored, not a crash
{
  const issues = validateGraph([node("alb", "aws-alb")], [edge("e1", "alb", "ghost")]);
  assert(issues.size === 0, "edge to unknown node ignored");
}

console.log("OK — validation engine rules verified.");
