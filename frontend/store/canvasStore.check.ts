/**
 * Runnable check for canvas store logic.
 * Run: bun run store/canvasStore.check.ts
 *
 * Covers the error-prone paths: history push/undo/redo ordering, delete cascading
 * to edges, duplicate offset, and redo-invalidation after a new mutation.
 */
import { useCanvasStore } from "./canvasStore";

const s = () => useCanvasStore.getState();
const assert = (cond: boolean, msg: string) => {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
};

// Fresh
s().load({ nodes: [], edges: [] });

// add two nodes
s().addNode("aws-alb", { x: 0, y: 0 });
s().addNode("aws-rds", { x: 200, y: 0 });
assert(s().nodes.length === 2, "two nodes added");

// connect them
const [a, b] = s().nodes;
s().onConnect({ source: a.id, target: b.id, sourceHandle: null, targetHandle: null });
assert(s().edges.length === 1, "edge added");

// delete source → edge must cascade away
s().deleteNode(a.id);
assert(s().nodes.length === 1, "node deleted");
assert(s().edges.length === 0, "edge cascaded on delete");

// undo delete → node + edge return
s().undo();
assert(s().nodes.length === 2 && s().edges.length === 1, "undo restored node+edge");

// redo → back to deleted state
s().redo();
assert(s().nodes.length === 1 && s().edges.length === 0, "redo re-deleted");

// new mutation invalidates redo
s().undo(); // back to 2 nodes
s().addNode("aws-s3", { x: 0, y: 200 }); // structural change
assert(s().future.length === 0, "redo stack cleared after new mutation");

// duplicate offsets position and copies name
const target = s().nodes[0];
s().duplicateNode(target.id);
const dup = s().nodes.at(-1)!;
assert(dup.position.x === target.position.x + 32, "duplicate x offset");
assert(dup.data.name.endsWith("copy"), "duplicate name suffix");

// rename
s().renameNode(dup.id, "web-tier");
assert(s().nodes.find((n) => n.id === dup.id)?.data.name === "web-tier", "rename applied");

console.log("OK — canvas store history/delete/duplicate/rename verified.");
