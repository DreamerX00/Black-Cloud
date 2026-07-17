"use client";

// The React Flow canvas: seed topology, drag/click add, connect with validation,
// animated edges, MiniMap + Controls + Background. Selection state is lifted here
// and rendered into the library (left) and inspector (right).
import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type OnConnect,
  type NodeMouseHandler,
  MarkerType,
} from "@xyflow/react";
import { toast } from "sonner";
import "@xyflow/react/dist/style.css";
import { CATALOG, type Service } from "@/lib/catalog/nodes";
import { PROVIDER_COLOR } from "@/lib/brand-icons";
import { NodeLibrary } from "./node-library";
import { Inspector } from "./inspector";
import { ServiceNode, type ServiceFlowNode, type ServiceNodeData } from "./service-node";
import { kindOf, invalidEdgeReason } from "./kinds";

const nodeTypes = { service: ServiceNode };

function svcById(id: string): Service {
  return CATALOG.find((s) => s.id === id)!;
}

// Deterministic node data from a catalog service — status seeded from index so it
// varies visually without any runtime randomness (hydration-safe).
const STATUSES: ServiceNodeData["status"][] = ["success", "success", "warning", "success", "danger"];
function makeData(svc: Service, seed: number): ServiceNodeData {
  return {
    serviceId: svc.id,
    name: svc.name,
    provider: svc.provider,
    blurb: svc.blurb,
    kind: kindOf(svc),
    status: STATUSES[seed % STATUSES.length],
  };
}

function seedNode(id: string, serviceId: string, x: number, y: number, seed: number): ServiceFlowNode {
  return { id, type: "service", position: { x, y }, data: makeData(svcById(serviceId), seed) };
}

const SEED_NODES: ServiceFlowNode[] = [
  seedNode("n-cloudfront", "cloudfront", 40, 40, 0),
  seedNode("n-ec2", "ec2", 340, 40, 1),
  seedNode("n-lambda", "lambda", 340, 200, 2),
  seedNode("n-rds", "rds", 660, 40, 3),
  seedNode("n-s3", "s3", 660, 200, 4),
];

const animatedEdge = (id: string, source: string, target: string): Edge => ({
  id,
  source,
  target,
  animated: true,
  style: { stroke: "var(--accent-cyan)", strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "var(--accent-cyan)" },
});

const SEED_EDGES: Edge[] = [
  animatedEdge("e1", "n-cloudfront", "n-ec2"),
  animatedEdge("e2", "n-ec2", "n-rds"),
  animatedEdge("e3", "n-ec2", "n-s3"),
  animatedEdge("e4", "n-cloudfront", "n-lambda"),
];

let addCounter = 0;

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<ServiceFlowNode>(SEED_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(SEED_EDGES);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addService = useCallback(
    (svc: Service, position?: { x: number; y: number }) => {
      addCounter += 1;
      const id = `n-${svc.id}-${addCounter}`;
      // Fan new nodes out so click-adds don't stack; drops use the real point.
      const pos = position ?? { x: 120 + (addCounter % 5) * 40, y: 340 + (addCounter % 5) * 30 };
      const node: ServiceFlowNode = { id, type: "service", position: pos, data: makeData(svc, addCounter) };
      setNodes((nds) => nds.concat(node));
      setSelectedId(id);
    },
    [setNodes],
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const source = nodes.find((n) => n.id === connection.source);
      const target = nodes.find((n) => n.id === connection.target);
      if (!source || !target) return;
      const reason = invalidEdgeReason(source.data.kind, target.data.kind);
      if (reason) {
        toast.error("Invalid connection", { description: reason });
        return;
      }
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: "var(--accent-cyan)", strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: "var(--accent-cyan)" },
          },
          eds,
        ),
      );
      toast.success("Connected", { description: `${source.data.name} → ${target.data.name}` });
    },
    [nodes, setEdges],
  );

  const onNodeClick: NodeMouseHandler<ServiceFlowNode> = useCallback((_, node) => setSelectedId(node.id), []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const serviceId = event.dataTransfer.getData("application/blackcloud-service");
      const svc = CATALOG.find((s) => s.id === serviceId);
      if (!svc) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      addService(svc, { x: event.clientX - bounds.left - 105, y: event.clientY - bounds.top - 30 });
    },
    [addService],
  );

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      setSelectedId((cur) => (cur === id ? null : cur));
    },
    [setNodes, setEdges],
  );

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedId) ?? null, [nodes, selectedId]);

  const connections = useMemo(() => {
    if (!selectedNode) return [];
    return edges
      .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
      .map((e) => {
        const otherId = e.source === selectedNode.id ? e.target : e.source;
        const other = nodes.find((n) => n.id === otherId);
        if (!other) return null;
        return {
          id: e.id,
          name: other.data.name,
          provider: other.data.provider,
          serviceId: other.data.serviceId,
          dir: (e.source === selectedNode.id ? "out" : "in") as "in" | "out",
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [selectedNode, edges, nodes]);

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[240px_1fr_300px]">
      <div className="hidden min-h-0 lg:block">
        <NodeLibrary onAdd={(svc) => addService(svc)} />
      </div>

      <div
        className="clay-inset relative min-h-[520px] overflow-hidden rounded-2xl lg:min-h-0"
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
      >
        <ReactFlow<ServiceFlowNode>
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={() => setSelectedId(null)}
          fitView
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ style: { stroke: "var(--accent-cyan)" } }}
          className="bg-transparent"
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.5} color="var(--accent-violet)" />
          <Controls className="!rounded-xl !border-border !bg-background/80 !backdrop-blur [&_button]:!border-border [&_button]:!bg-transparent" />
          <MiniMap
            pannable
            zoomable
            className="!rounded-xl !bg-background/70 !backdrop-blur"
            maskColor="oklch(0 0 0 / 0.5)"
            nodeColor={(n) => PROVIDER_COLOR[(n as ServiceFlowNode).data.provider]}
          />
        </ReactFlow>
      </div>

      <div className="hidden min-h-0 lg:block">
        <Inspector node={selectedNode} connections={connections} onDelete={deleteNode} />
      </div>
    </div>
  );
}

export function PlaygroundCanvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
