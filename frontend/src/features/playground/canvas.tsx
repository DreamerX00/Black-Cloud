"use client";

import { useCallback, useMemo, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeTypes,
  type ProOptions,
} from "@xyflow/react";

import { CloudNode } from "./nodes/cloud-node";
import { NODE_BY_ID } from "@/lib/nodes/registry";
import {
  selectAddNode,
  selectEdges,
  selectNodes,
  selectOnConnect,
  selectOnEdgesChange,
  selectOnNodesChange,
  useCanvas,
} from "@/store/canvas";

// ── Perf-critical constants ─────────────────────────────────────────────────
// nodeTypes MUST be defined outside render — React Flow prints a big warning
// otherwise and re-mounts every node on every render (blows the 60fps budget).
const nodeTypes: NodeTypes = { cloud: CloudNode };

// Suppress the "Pro" attribution overlay — we don't ship a paid feature; this
// is only for the branded canvas.
const proOptions: ProOptions = { hideAttribution: true };

// Default viewport keeps the origin visible on first paint.
const defaultViewport = { x: 0, y: 0, zoom: 1 };

/**
 * Canvas is the main React Flow surface. Perf notes:
 *   1. Zustand selectors are targeted — one selector per slice; no shape objects.
 *   2. `nodeTypes` / `proOptions` / `defaultViewport` are module-level.
 *   3. `onNodesChange` etc. are stable Zustand references — passed straight in.
 */
function CanvasInner() {
  const nodes = useCanvas(selectNodes);
  const edges = useCanvas(selectEdges);
  const onNodesChange = useCanvas(selectOnNodesChange);
  const onEdgesChange = useCanvas(selectOnEdgesChange);
  const onConnect = useCanvas(selectOnConnect);
  const addNode = useCanvas(selectAddNode);
  const wrapper = useRef<HTMLDivElement | null>(null);

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const registryId = e.dataTransfer.getData("application/bc-node");
      if (!registryId || !NODE_BY_ID.has(registryId)) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNode(registryId, position);
    },
    [addNode, screenToFlowPosition],
  );

  // Style overrides live in-component (rather than in globals.css) because
  // they piggyback on our design tokens without polluting the global scope.
  const styleOverrides = useMemo(
    () =>
      ({
        "--xy-background-color": "var(--bc-void)",
        "--xy-node-color": "var(--foreground)",
        "--xy-edge-stroke-default": "rgba(255,255,255,0.35)",
        "--xy-edge-stroke-selected": "var(--bc-ai)",
        "--xy-controls-button-background-color": "var(--bc-graphite)",
        "--xy-controls-button-background-color-hover": "var(--bc-graphite-2)",
        "--xy-controls-button-color": "var(--foreground)",
        "--xy-controls-button-border-color": "var(--border)",
        "--xy-minimap-background-color": "rgba(11,15,23,0.9)",
      }) as React.CSSProperties,
    [],
  );

  return (
    <div
      ref={wrapper}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="relative h-full w-full"
      style={{ ...styleOverrides, contain: "strict" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        defaultViewport={defaultViewport}
        fitView={nodes.length > 0}
        minZoom={0.2}
        maxZoom={2.5}
        snapToGrid
        snapGrid={[16, 16]}
        deleteKeyCode={["Delete", "Backspace"]}
        panOnDrag
        selectionOnDrag
        multiSelectionKeyCode="Shift"
        className="bg-void"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1.2}
          color="rgba(255,255,255,0.08)"
        />
        <Controls
          showInteractive={false}
          className="!rounded-md !border !border-border/60 !bg-graphite/70 !backdrop-blur"
        />
        <MiniMap
          pannable
          zoomable
          maskColor="rgba(5,5,5,0.7)"
          nodeStrokeColor="rgba(255,255,255,0.5)"
          nodeColor={(n) => {
            const registryId = (n.data as { registryId?: string })?.registryId;
            if (!registryId) return "#666";
            const def = NODE_BY_ID.get(registryId);
            return def?.accent ?? "#666";
          }}
          className="!border !border-border/60"
        />
      </ReactFlow>
    </div>
  );
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
