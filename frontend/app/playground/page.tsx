"use client";

import {
  useState,
  useCallback,
  useMemo,
  useRef,
  type DragEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
  type OnConnect,
  type NodeProps,
  BackgroundVariant,
  Handle,
  Position,
  getBezierPath,
  BaseEdge,
  type EdgeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  MousePointer2,
  Move,
  Cable,
  Trash2,
  Undo2,
  Redo2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  GripVertical,
  CheckCircle2,
  AlertTriangle,
  Tag,
  X,
  Download,
  Share2,
  Save,
  Play,
  Zap,
} from "lucide-react";
import { AppFrame } from "@/components/layout/app-frame";
import { PROVIDER_COLOR } from "@/lib/brand-icons";
import {
  CATALOG,
  getPopularServices,
  getServicesByProvider,
  searchServices,
  type CatalogNode,
} from "@/lib/catalog/nodes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────────────── */

type InfraNodeData = {
  label: string;
  provider: "aws" | "azure" | "gcp";
  category: string;
  icon: string | null;
  status: "running" | "stopped" | "warning";
  catalogId: string;
};

type ValidationIssue = {
  type: "error" | "warning";
  message: string;
  nodeId?: string;
  edgeId?: string;
};

/* ── Validation Rules ──────────────────────────────────────────────── */

const INVALID_CONNECTIONS: [string, string][] = [
  ["networking", "database"],  // ALB → RDS is invalid
  ["cdn", "database"],         // CloudFront → RDS is invalid
  ["storage", "compute"],      // S3 → EC2 backwards
];

function validateArchitecture(
  nodes: Node<InfraNodeData>[],
  edges: Edge[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check for invalid direct connections
  for (const edge of edges) {
    const source = nodes.find((n) => n.id === edge.source);
    const target = nodes.find((n) => n.id === edge.target);
    if (!source || !target) continue;

    const srcCat = source.data.category;
    const tgtCat = target.data.category;

    for (const [from, to] of INVALID_CONNECTIONS) {
      if (srcCat === from && tgtCat === to) {
        issues.push({
          type: "error",
          message: `Invalid: ${source.data.label} → ${target.data.label}. ${srcCat} cannot connect directly to ${tgtCat}.`,
          edgeId: edge.id,
        });
      }
    }
  }

  // Check for isolated nodes
  for (const node of nodes) {
    const hasConnection = edges.some(
      (e) => e.source === node.id || e.target === node.id
    );
    if (!hasConnection && nodes.length > 1) {
      issues.push({
        type: "warning",
        message: `${node.data.label} is not connected to any service.`,
        nodeId: node.id,
      });
    }
  }

  return issues;
}

/* ── Custom Infrastructure Node ───────────────────────────────────── */

function InfraNode({ data, selected }: NodeProps<Node<InfraNodeData>>) {
  const color = PROVIDER_COLOR[data.provider] ?? "#8B5CF6";
  const statusColor =
    data.status === "running"
      ? "#22C55E"
      : data.status === "warning"
        ? "#F59E0B"
        : "#EF4444";

  return (
    <div
      className={cn(
        "relative rounded-2xl border p-3 min-w-[160px]",
        "bg-graphite/90 backdrop-blur-md transition-all duration-200",
        selected
          ? "border-violet-500 shadow-[0_0_24px_rgba(139,92,246,0.35)]"
          : "border-white/10 hover:border-white/20 hover:shadow-[0_0_12px_rgba(139,92,246,0.1)]"
      )}
      style={{
        boxShadow: selected
          ? `0 0 24px ${color}30, inset 2px 2px 4px rgba(255,255,255,0.05), inset -2px -2px 4px rgba(0,0,0,0.3)`
          : "inset 1px 1px 2px rgba(255,255,255,0.04), inset -1px -1px 2px rgba(0,0,0,0.2), 2px 2px 8px rgba(0,0,0,0.4)",
      }}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !rounded-full !bg-graphite !border-2 !border-white/20 hover:!border-violet-400 hover:!shadow-[0_0_8px_rgba(139,92,246,0.5)] transition-all"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !rounded-full !bg-graphite !border-2 !border-white/20 hover:!border-cyan-400 hover:!shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !rounded-full !bg-graphite !border-2 !border-white/20 hover:!border-violet-400 transition-all"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-3 !h-3 !rounded-full !bg-graphite !border-2 !border-white/20 hover:!border-cyan-400 transition-all"
      />

      <div className="flex items-center gap-3">
        {data.icon ? (
          <img
            src={data.icon}
            alt={data.label}
            className="w-8 h-8 shrink-0"
            draggable={false}
          />
        ) : (
          <div
            className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: color + "20",
              border: `1px solid ${color}40`,
              color: color,
            }}
          >
            {data.label.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-display font-semibold text-white truncate">
            {data.label}
          </p>
          <p className="text-[10px] text-muted-foreground capitalize">
            {data.category}
          </p>
        </div>
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
          style={{
            backgroundColor: statusColor,
            boxShadow: `0 0 8px ${statusColor}80`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Custom Animated Edge ─────────────────────────────────────────── */

function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {/* Animated traffic dot 1 */}
      <circle r={3} fill="#8B5CF6">
        <animateMotion
          dur="2.5s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
      {/* Animated traffic dot 2 (offset) */}
      <circle r={2.5} fill="#06B6D4" opacity={0.7}>
        <animateMotion
          dur="2.5s"
          repeatCount="indefinite"
          path={edgePath}
          begin="1.2s"
        />
      </circle>
    </>
  );
}

/* ── Node & Edge Type Maps ────────────────────────────────────────── */

const nodeTypes: NodeTypes = {
  infra: InfraNode,
};

const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};

/* ── Initial Demo Layout ──────────────────────────────────────────── */

const INITIAL_NODES: Node<InfraNodeData>[] = [
  {
    id: "n1",
    type: "infra",
    position: { x: 50, y: 200 },
    data: {
      label: "Route 53",
      provider: "aws",
      category: "networking",
      icon: "/AWS-ICONS/Arch_Amazon-Route-53/48/Arch_Amazon-Route-53_48.svg",
      status: "running",
      catalogId: "aws-route53",
    },
  },
  {
    id: "n2",
    type: "infra",
    position: { x: 300, y: 200 },
    data: {
      label: "CloudFront",
      provider: "aws",
      category: "cdn",
      icon: "/AWS-ICONS/Arch_Amazon-CloudFront/48/Arch_Amazon-CloudFront_48.svg",
      status: "running",
      catalogId: "aws-cloudfront",
    },
  },
  {
    id: "n3",
    type: "infra",
    position: { x: 550, y: 200 },
    data: {
      label: "ALB",
      provider: "aws",
      category: "networking",
      icon: "/AWS-ICONS/Arch_Elastic-Load-Balancing/48/Arch_Elastic-Load-Balancing_48.svg",
      status: "running",
      catalogId: "aws-alb",
    },
  },
  {
    id: "n4",
    type: "infra",
    position: { x: 800, y: 100 },
    data: {
      label: "ECS",
      provider: "aws",
      category: "container",
      icon: "/AWS-ICONS/Arch_Amazon-Elastic-Container-Service/48/Arch_Amazon-Elastic-Container-Service_48.svg",
      status: "running",
      catalogId: "aws-ecs",
    },
  },
  {
    id: "n5",
    type: "infra",
    position: { x: 800, y: 300 },
    data: {
      label: "Lambda",
      provider: "aws",
      category: "serverless",
      icon: "/AWS-ICONS/Arch_AWS-Lambda/48/Arch_AWS-Lambda_48.svg",
      status: "running",
      catalogId: "aws-lambda",
    },
  },
  {
    id: "n6",
    type: "infra",
    position: { x: 1100, y: 100 },
    data: {
      label: "RDS",
      provider: "aws",
      category: "database",
      icon: "/AWS-ICONS/Arch_Amazon-RDS/48/Arch_Amazon-RDS_48.svg",
      status: "running",
      catalogId: "aws-rds",
    },
  },
  {
    id: "n7",
    type: "infra",
    position: { x: 1100, y: 300 },
    data: {
      label: "DynamoDB",
      provider: "aws",
      category: "database",
      icon: "/AWS-ICONS/Arch_Amazon-DynamoDB/48/Arch_Amazon-DynamoDB_48.svg",
      status: "running",
      catalogId: "aws-dynamodb",
    },
  },
  {
    id: "n8",
    type: "infra",
    position: { x: 1100, y: 480 },
    data: {
      label: "S3",
      provider: "aws",
      category: "storage",
      icon: "/AWS-ICONS/Arch_Amazon-Simple-Storage-Service/48/Arch_Amazon-Simple-Storage-Service_48.svg",
      status: "running",
      catalogId: "aws-s3",
    },
  },
];

const INITIAL_EDGES: Edge[] = [
  {
    id: "e1-2",
    source: "n1",
    target: "n2",
    type: "animated",
    style: { stroke: "#8B5CF680", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8B5CF6" },
  },
  {
    id: "e2-3",
    source: "n2",
    target: "n3",
    type: "animated",
    style: { stroke: "#8B5CF680", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8B5CF6" },
  },
  {
    id: "e3-4",
    source: "n3",
    target: "n4",
    type: "animated",
    style: { stroke: "#8B5CF680", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8B5CF6" },
  },
  {
    id: "e3-5",
    source: "n3",
    target: "n5",
    type: "animated",
    style: { stroke: "#8B5CF680", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8B5CF6" },
  },
  {
    id: "e4-6",
    source: "n4",
    target: "n6",
    type: "animated",
    style: { stroke: "#8B5CF680", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8B5CF6" },
  },
  {
    id: "e5-7",
    source: "n5",
    target: "n7",
    type: "animated",
    style: { stroke: "#8B5CF680", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8B5CF6" },
  },
  {
    id: "e5-8",
    source: "n5",
    target: "n8",
    type: "animated",
    style: { stroke: "#06B6D480", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#06B6D4" },
  },
];

/* ── Helpers ──────────────────────────────────────────────────────── */

let nodeIdCounter = 100;
function nextNodeId() {
  return `node-${++nodeIdCounter}`;
}

/* ── Main Page ────────────────────────────────────────────────────── */

export default function PlaygroundPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [providerTab, setProviderTab] = useState("all");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  /* ── Validation ─── */
  const issues = useMemo(
    () => validateArchitecture(nodes as Node<InfraNodeData>[], edges),
    [nodes, edges]
  );
  const errorCount = issues.filter((i) => i.type === "error").length;
  const warningCount = issues.filter((i) => i.type === "warning").length;

  /* ── Selected node ─── */
  const selectedNode = nodes.find(
    (n) => n.id === selectedNodeId
  ) as Node<InfraNodeData> | undefined;

  /* ── Connection handler ─── */
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: `e${connection.source}-${connection.target}`,
        type: "animated",
        style: { stroke: "#8B5CF680", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#8B5CF6" },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  /* ── Node selection ─── */
  const onNodeClick = useCallback(
    (_: ReactMouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
      if (!rightOpen) setRightOpen(true);
    },
    [rightOpen]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  /* ── Drag-and-drop from catalog ─── */
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const catalogId = event.dataTransfer.getData("application/blackcloud-service");
      if (!catalogId) return;

      const service = CATALOG.find((s) => s.id === catalogId);
      if (!service) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      const newNode: Node<InfraNodeData> = {
        id: nextNodeId(),
        type: "infra",
        position: {
          x: event.clientX - bounds.left - 80,
          y: event.clientY - bounds.top - 40,
        },
        data: {
          label: service.name,
          provider: service.provider,
          category: service.category,
          icon: service.icon,
          status: "running",
          catalogId: service.id,
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  /* ── Delete selected ─── */
  const deleteSelected = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
      )
    );
    setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges]);

  /* ── Service catalog filter ─── */
  const filteredServices = useMemo(() => {
    if (searchQuery.trim()) return searchServices(searchQuery);
    if (providerTab === "all") return getPopularServices();
    return getServicesByProvider(providerTab);
  }, [searchQuery, providerTab]);

  /* ── Connected services for inspector ─── */
  const connectedServices = useMemo(() => {
    if (!selectedNodeId) return [];
    return edges
      .filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
      .map((e) => {
        const otherId =
          e.source === selectedNodeId ? e.target : e.source;
        const other = nodes.find((n) => n.id === otherId);
        return other
          ? { id: otherId, label: (other.data as InfraNodeData).label, category: (other.data as InfraNodeData).category }
          : null;
      })
      .filter(Boolean);
  }, [selectedNodeId, edges, nodes]);

  return (
    <AppFrame title="Cloud Playground">
      <TooltipProvider delayDuration={200}>
        <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden -m-6">
          <div className="flex flex-1 min-h-0">
            {/* ── LEFT PANEL — Service Catalog ─────────────────────── */}
            <AnimatePresence initial={false}>
              {leftOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 264, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-66 shrink-0 bg-deep-space border-r border-white/5 flex flex-col overflow-hidden"
                  style={{
                    boxShadow:
                      "inset 2px 2px 4px rgba(255,255,255,0.03), inset -2px -2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  <div className="p-3 border-b border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-display font-semibold text-white">
                        Services
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setLeftOpen(false)}
                      >
                        <PanelLeftClose className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-2">
                      Drag services onto the canvas
                    </p>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search services..."
                        className="pl-8 h-8 text-xs bg-graphite/50 border-white/5"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <Tabs
                    value={providerTab}
                    onValueChange={setProviderTab}
                    className="px-3 pt-2"
                  >
                    <TabsList className="w-full h-8 text-[10px]">
                      <TabsTrigger value="all" className="text-[10px] flex-1">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="aws" className="text-[10px] flex-1">
                        AWS
                      </TabsTrigger>
                      <TabsTrigger value="azure" className="text-[10px] flex-1">
                        Azure
                      </TabsTrigger>
                      <TabsTrigger value="gcp" className="text-[10px] flex-1">
                        GCP
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <ScrollArea className="flex-1 px-3 py-2">
                    <div className="space-y-1">
                      {filteredServices.map((svc) => (
                        <div
                          key={svc.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              "application/blackcloud-service",
                              svc.id
                            );
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 cursor-grab active:cursor-grabbing transition-colors group"
                        >
                          <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          {svc.icon ? (
                            <img
                              src={svc.icon}
                              alt={svc.name}
                              className="w-5 h-5 shrink-0"
                              draggable={false}
                            />
                          ) : (
                            <div
                              className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold"
                              style={{
                                backgroundColor:
                                  PROVIDER_COLOR[svc.provider] ?? "#8B5CF6",
                              }}
                            >
                              {svc.name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-white truncate">
                              {svc.name}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-[9px] h-4 px-1.5 capitalize border-white/10"
                          >
                            {svc.category}
                          </Badge>
                        </div>
                      ))}
                      {filteredServices.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-8">
                          No services found
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── CENTER — React Flow Canvas ───────────────────────── */}
            <div
              ref={reactFlowWrapper}
              className="flex-1 relative bg-void"
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                snapToGrid={snapToGrid}
                snapGrid={[20, 20]}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                deleteKeyCode="Delete"
                proOptions={{ hideAttribution: true }}
                defaultEdgeOptions={{
                  type: "animated",
                  style: { stroke: "#8B5CF680", strokeWidth: 2 },
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: "#8B5CF6",
                  },
                }}
                style={{ background: "#050505" }}
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={20}
                  size={1}
                  color="#ffffff08"
                />
                <Controls
                  className="!bg-graphite/80 !backdrop-blur-md !border-white/10 !rounded-xl !shadow-lg [&>button]:!bg-transparent [&>button]:!border-white/5 [&>button]:!text-white/60 [&>button:hover]:!bg-white/5 [&>button:hover]:!text-white"
                  position="bottom-left"
                />
                <MiniMap
                  className="!bg-graphite/80 !backdrop-blur-md !border-white/10 !rounded-xl"
                  nodeColor={(n) => {
                    const data = n.data as InfraNodeData;
                    return PROVIDER_COLOR[data.provider] ?? "#8B5CF6";
                  }}
                  maskColor="rgba(5,5,5,0.7)"
                  position="bottom-right"
                />

                {/* Floating toolbar */}
                <Panel position="top-center">
                  <div className="flex items-center gap-1 rounded-xl bg-graphite/80 backdrop-blur-md border border-white/10 p-1"
                    style={{
                      boxShadow:
                        "inset 1px 1px 2px rgba(255,255,255,0.04), 4px 4px 12px rgba(0,0,0,0.5)",
                    }}
                  >
                    {!leftOpen && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setLeftOpen(true)}
                          >
                            <PanelLeftOpen className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Show Services</TooltipContent>
                      </Tooltip>
                    )}

                    <div className="w-px h-5 bg-white/10 mx-0.5" />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Undo2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Undo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Redo2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Redo</TooltipContent>
                    </Tooltip>

                    <div className="w-px h-5 bg-white/10 mx-0.5" />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8",
                            selectedNodeId &&
                              "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          )}
                          onClick={deleteSelected}
                          disabled={!selectedNodeId}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Selected</TooltipContent>
                    </Tooltip>

                    <div className="w-px h-5 bg-white/10 mx-0.5" />

                    <div className="flex items-center gap-1.5 px-2">
                      <span className="text-[10px] text-muted-foreground">
                        Snap
                      </span>
                      <Switch
                        checked={snapToGrid}
                        onCheckedChange={setSnapToGrid}
                        className="scale-75"
                      />
                    </div>

                    <div className="w-px h-5 bg-white/10 mx-0.5" />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Save className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save Project</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Export</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share</TooltipContent>
                    </Tooltip>

                    {!rightOpen && (
                      <>
                        <div className="w-px h-5 bg-white/10 mx-0.5" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setRightOpen(true)}
                            >
                              <PanelRightOpen className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Show Inspector</TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </Panel>

                {/* Validation floating panel */}
                {issues.length > 0 && (
                  <Panel position="top-right">
                    <div className="rounded-xl bg-graphite/80 backdrop-blur-md border border-white/10 p-3 max-w-[240px]"
                      style={{
                        boxShadow:
                          "inset 1px 1px 2px rgba(255,255,255,0.04), 4px 4px 12px rgba(0,0,0,0.5)",
                      }}
                    >
                      <h4 className="text-xs font-display font-semibold text-white mb-2 flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-warning" />
                        Validation
                      </h4>
                      <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                        {issues.slice(0, 5).map((issue, i) => (
                          <div
                            key={i}
                            className={cn(
                              "text-[10px] p-1.5 rounded-lg flex items-start gap-1.5",
                              issue.type === "error"
                                ? "bg-red-500/10 text-red-300"
                                : "bg-amber-500/10 text-amber-300"
                            )}
                          >
                            {issue.type === "error" ? (
                              <X className="h-3 w-3 shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                            )}
                            {issue.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Panel>
                )}
              </ReactFlow>
            </div>

            {/* ── RIGHT PANEL — Inspector ──────────────────────────── */}
            <AnimatePresence initial={false}>
              {rightOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 288, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-72 shrink-0 bg-deep-space border-l border-white/5 flex flex-col overflow-hidden"
                  style={{
                    boxShadow:
                      "inset 2px 2px 4px rgba(255,255,255,0.03), inset -2px -2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  <div className="p-3 border-b border-white/5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-display font-semibold text-white">
                        Inspector
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setRightOpen(false)}
                      >
                        <PanelRightClose className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-3">
                    {selectedNode ? (
                      <motion.div
                        key={selectedNode.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Node preview */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-graphite/50 border border-white/5">
                          {selectedNode.data.icon ? (
                            <img
                              src={selectedNode.data.icon}
                              alt={selectedNode.data.label}
                              className="w-10 h-10"
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                              style={{
                                backgroundColor:
                                  PROVIDER_COLOR[selectedNode.data.provider] +
                                  "20",
                                color:
                                  PROVIDER_COLOR[selectedNode.data.provider],
                              }}
                            >
                              {selectedNode.data.label.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-display font-semibold text-white">
                              {selectedNode.data.label}
                            </p>
                            <p className="text-[10px] text-muted-foreground capitalize">
                              {selectedNode.data.category} ·{" "}
                              {selectedNode.data.provider.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        {/* Name */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">
                            Name
                          </label>
                          <Input
                            defaultValue={selectedNode.data.label}
                            className="h-8 text-xs bg-graphite/50 border-white/5"
                          />
                        </div>

                        {/* Type + Provider */}
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">
                              Type
                            </label>
                            <Badge
                              variant="outline"
                              className="text-[10px] capitalize border-white/10"
                            >
                              {selectedNode.data.category}
                            </Badge>
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">
                              Provider
                            </label>
                            <Badge
                              className="text-[10px] uppercase"
                              style={{
                                backgroundColor:
                                  PROVIDER_COLOR[selectedNode.data.provider] +
                                  "20",
                                color:
                                  PROVIDER_COLOR[selectedNode.data.provider],
                                borderColor:
                                  PROVIDER_COLOR[selectedNode.data.provider] +
                                  "40",
                              }}
                            >
                              {selectedNode.data.provider}
                            </Badge>
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">
                            Status
                          </label>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="h-3 w-3" /> Running
                            </span>
                            <Switch defaultChecked />
                          </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        {/* Position */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">
                            Position
                          </label>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="text-[9px] text-muted-foreground mb-1 block">
                                X
                              </label>
                              <Input
                                value={Math.round(
                                  selectedNode.position.x
                                )}
                                readOnly
                                className="h-7 text-xs font-mono bg-graphite/50 border-white/5"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-[9px] text-muted-foreground mb-1 block">
                                Y
                              </label>
                              <Input
                                value={Math.round(
                                  selectedNode.position.y
                                )}
                                readOnly
                                className="h-7 text-xs font-mono bg-graphite/50 border-white/5"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        {/* Tags */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">
                            Tags
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {["production", "us-east-1"].map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-[9px] h-5 pl-1.5 pr-1 border-white/10 flex items-center gap-1"
                              >
                                <Tag className="h-2.5 w-2.5" />
                                {tag}
                                <X className="h-2.5 w-2.5 opacity-50 hover:opacity-100 cursor-pointer" />
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        {/* Connected to */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">
                            Connected to
                          </label>
                          <div className="space-y-1.5">
                            {connectedServices.map((svc) =>
                              svc ? (
                                <div
                                  key={svc.id}
                                  className="flex items-center gap-2 text-xs text-muted-foreground"
                                >
                                  <Cable className="h-3 w-3 text-violet-400" />
                                  <span className="text-white">
                                    {svc.label}
                                  </span>
                                  <span className="text-[10px] capitalize">
                                    ({svc.category})
                                  </span>
                                </div>
                              ) : null
                            )}
                            {connectedServices.length === 0 && (
                              <p className="text-[10px] text-muted-foreground italic">
                                No connections
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        {/* Delete */}
                        <Button
                          variant="outline"
                          className="w-full h-8 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          onClick={deleteSelected}
                        >
                          <Trash2 className="h-3 w-3 mr-1.5" /> Delete Node
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <MousePointer2 className="h-8 w-8 text-muted-foreground/30 mb-3" />
                        <p className="text-xs text-muted-foreground">
                          Select a node to inspect
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          Click any service on the canvas
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── BOTTOM STATUS BAR ─────────────────────────────────── */}
          <div
            className="h-8 shrink-0 bg-deep-space border-t border-white/5 flex items-center px-4 gap-4 text-[11px] text-muted-foreground font-mono"
            style={{
              boxShadow:
                "inset 0 1px 2px rgba(255,255,255,0.03)",
            }}
          >
            <span>{nodes.length} nodes</span>
            <span className="text-white/10">·</span>
            <span>{edges.length} connections</span>
            <span className="text-white/10">·</span>
            {errorCount > 0 ? (
              <span className="text-red-400 flex items-center gap-1">
                <X className="h-3 w-3" /> {errorCount} error
                {errorCount > 1 ? "s" : ""}
              </span>
            ) : warningCount > 0 ? (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {warningCount} warning
                {warningCount > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Valid
              </span>
            )}
            <div className="flex-1" />
            <span>
              {snapToGrid ? "Grid: 20px" : "Freeform"}
            </span>
            <span className="text-white/10">·</span>
            <span className="flex items-center gap-1">
              <Play className="h-3 w-3 text-emerald-400" /> Live
            </span>
          </div>
        </div>
      </TooltipProvider>
    </AppFrame>
  );
}
