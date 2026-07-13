"use client";

import { useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  type NodeTypes,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useCanvasStore } from "@/store/canvasStore";
import { validateGraph } from "@/features/validation/engine";
import { getService, PROVIDER_META } from "@/lib/catalog/nodes";
import type { CloudNode as CloudNodeT, CloudEdge } from "@/types/graph";
import { CloudNode } from "./cloud-node";
import { NodePalette } from "./node-palette";
import { Inspector } from "./inspector";
import { useCanvasShortcuts } from "./use-canvas-shortcuts";

// Defined once at module scope — a new object here would re-register node types
// every render and tank performance (a classic React Flow footgun).
const nodeTypes: NodeTypes = { cloud: CloudNode };

function Flow() {
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const onNodesChange = useCanvasStore((s) => s.onNodesChange);
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
  const onConnect = useCanvasStore((s) => s.onConnect);
  const addNode = useCanvasStore((s) => s.addNode);
  const commitInteraction = useCanvasStore((s) => s.commitInteraction);

  const { screenToFlowPosition } = useReactFlow();
  const wrapper = useRef<HTMLDivElement>(null);

  // Validation runs on the current graph; memoized so it only recomputes when
  // the graph structure changes, not on viewport pans.
  const issues = useMemo(() => validateGraph(nodes, edges), [nodes, edges]);

  // Paint edges by validation status (green ok / amber warning / red error).
  const styledEdges = useMemo<CloudEdge[]>(
    () =>
      edges.map((e) => {
        const issue = issues.get(e.id);
        const stroke = issue
          ? issue.severity === "error"
            ? "var(--color-danger)"
            : "var(--color-warning)"
          : "var(--color-fg-subtle)";
        return {
          ...e,
          animated: issue?.severity === "error",
          style: { stroke, strokeWidth: 2 },
        };
      }),
    [edges, issues],
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const serviceId = event.dataTransfer.getData("application/blackcloud-service");
      if (!serviceId) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      addNode(serviceId, position);
    },
    [screenToFlowPosition, addNode],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  useCanvasShortcuts();

  return (
    <div className="flex h-full min-h-0 flex-1">
      <NodePalette />

      <div ref={wrapper} className="relative min-w-0 flex-1" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow<CloudNodeT, CloudEdge>
          nodes={nodes}
          edges={styledEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // Snapshot before a drag so the whole move is one undo step (not per-frame).
          onNodeDragStart={commitInteraction}
          nodeTypes={nodeTypes}
          snapToGrid
          snapGrid={[16, 16]}
          fitView
          minZoom={0.2}
          maxZoom={2}
          // Perf: skip rendering nodes/edges outside the viewport (matters at 100+ nodes).
          onlyRenderVisibleElements
          proOptions={{ hideAttribution: true }}
          className="bg-void"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#21262d" />
          <Controls className="!border-border-strong !bg-graphite" />
          <MiniMap
            pannable
            zoomable
            className="!bg-deep-space"
            maskColor="rgba(5,5,5,0.6)"
            nodeColor={(n) => {
              const svc = getService((n.data as CloudNodeT["data"]).serviceId);
              return svc ? PROVIDER_META[svc.provider].accentVar : "#6a7581";
            }}
          />
        </ReactFlow>
      </div>

      <Inspector issues={issues} />
    </div>
  );
}

/** Public entry — wraps Flow in the provider so useReactFlow() works. */
export function PlaygroundCanvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

// Re-export instance type for callers that persist the viewport later.
export type { ReactFlowInstance };
