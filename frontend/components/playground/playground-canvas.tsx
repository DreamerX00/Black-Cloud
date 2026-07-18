"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  type NodeTypes,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo, useState } from "react";
import { CloudNode, type CloudNodeData } from "./cloud-node";
import { CATALOG, catalogByProvider, type Provider, type NodeSpec } from "./node-library";
import { AnimatePresence, motion } from "motion/react";
import {
  Layers,
  Search,
  Boxes,
  Grid3x3,
  Undo2,
  Redo2,
  Save,
  Sparkles,
  ShieldAlert,
  Coins,
  Play,
  X,
  Circle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { PillButton } from "@/components/ui/pill-button";
import { HealthRing } from "@/components/app/health-ring";
import { toast } from "sonner";

const nodeTypes: NodeTypes = { cloud: CloudNode };

const INITIAL_NODES: Node<CloudNodeData>[] = [
  { id: "r53",   type: "cloud", position: { x:  20, y:  60 }, data: { label: "Route 53",     short: "R53", provider: "aws", color: "#8b5cf6", status: "ok" } },
  { id: "cf",    type: "cloud", position: { x: 280, y:  60 }, data: { label: "CloudFront",   short: "CF",  provider: "aws", color: "#38bdf8", status: "ok" } },
  { id: "alb",   type: "cloud", position: { x: 540, y:  60 }, data: { label: "ALB",          short: "ALB", provider: "aws", color: "#ff9900", status: "ok" } },
  { id: "ecs",   type: "cloud", position: { x: 800, y:  60 }, data: { label: "ECS",          short: "ECS", provider: "aws", color: "#22c55e", status: "ok" } },
  { id: "rds",   type: "cloud", position: { x: 800, y: 240 }, data: { label: "RDS Postgres", short: "RDS", provider: "aws", color: "#ef4444", status: "warning" } },
  { id: "s3",    type: "cloud", position: { x: 540, y: 240 }, data: { label: "S3",           short: "S3",  provider: "aws", color: "#f59e0b", status: "ok" } },
  { id: "redis", type: "cloud", position: { x: 280, y: 240 }, data: { label: "Redis",        short: "RED", provider: "aws", color: "#ef4444", status: "ok" } },
];

const INITIAL_EDGES: Edge[] = [
  { id: "e1", source: "r53",   target: "cf",  animated: true, style: { stroke: "#8b5cf6" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" } },
  { id: "e2", source: "cf",    target: "alb", animated: true, style: { stroke: "#38bdf8" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#38bdf8" } },
  { id: "e3", source: "alb",   target: "ecs", animated: true, style: { stroke: "#ff9900" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#ff9900" } },
  { id: "e4", source: "ecs",   target: "rds", animated: true, style: { stroke: "#22c55e" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" } },
  { id: "e5", source: "ecs",   target: "s3",  animated: true, style: { stroke: "#22c55e" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" } },
  { id: "e6", source: "ecs",   target: "redis", animated: true, style: { stroke: "#22c55e" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" } },
];

function PlaygroundCanvasInner({ projectId }: { projectId: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selected, setSelected] = useState<Node<CloudNodeData> | null>(null);
  const [providerFilter, setProviderFilter] = useState<Provider>("aws");
  const [q, setQ] = useState("");

  const filteredCatalog = useMemo(() => {
    return catalogByProvider(providerFilter).filter(c =>
      q ? (c.label + c.short + c.category).toLowerCase().includes(q.toLowerCase()) : true
    );
  }, [providerFilter, q]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Simple validation: refuse ALB → RDS.
      const src = nodes.find(n => n.id === params.source);
      const tgt = nodes.find(n => n.id === params.target);
      if (src?.data.label.includes("ALB") && tgt?.data.label.includes("RDS")) {
        toast.error("Invalid: ALB → RDS", { description: "Recommended: ALB → ECS/EKS → RDS." });
        return;
      }
      setEdges(eds =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#8b5cf6" },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
          },
          eds
        )
      );
      toast.success("Edge added");
    },
    [nodes, setEdges]
  );

  const addNode = (spec: NodeSpec) => {
    const id = `${spec.id}-${Math.floor(Math.random() * 9999)}`;
    const n: Node<CloudNodeData> = {
      id,
      type: "cloud",
      position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 300 },
      data: { label: spec.label, short: spec.short, provider: spec.provider, color: spec.color, status: "ok" },
    };
    setNodes(ns => [...ns, n]);
    toast.success(`Added ${spec.label}`);
  };

  return (
    <div className="grid h-[calc(100dvh-13rem)] grid-cols-1 gap-4 md:grid-cols-[280px_1fr_320px]">
      {/* Node library drawer */}
      <div className="clay-lg flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-ai" />
            <span className="font-display text-sm font-semibold">Node library</span>
          </div>
          <span className="text-mono-caps text-ink-mute">{CATALOG.length}</span>
        </div>
        <div className="border-b border-white/8 p-3">
          <div className="clay-inset mb-2 flex items-center gap-2 rounded-lg px-3 py-2">
            <Search className="h-3.5 w-3.5 text-ink-mute" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="search…"
              data-cursor="text"
              className="w-full bg-transparent text-xs outline-none placeholder:text-ink-faint"
            />
          </div>
          <div className="grid grid-cols-3 gap-1">
            {(["aws", "azure", "gcp"] as Provider[]).map(p => (
              <button
                key={p}
                onClick={() => setProviderFilter(p)}
                className={cn(
                  "rounded-lg py-1.5 text-[10px] font-mono uppercase tracking-widest transition-colors",
                  providerFilter === p
                    ? p === "aws" ? "bg-aws/20 text-aws"
                    : p === "azure" ? "bg-azure/20 text-azure"
                    : "bg-gcp/20 text-gcp"
                    : "text-ink-mute hover:text-ink"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {filteredCatalog.map(spec => (
              <li key={spec.id}>
                <button
                  onClick={() => addNode(spec)}
                  className="clay-sm flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-white/5"
                >
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg font-mono text-[10px] font-semibold text-void"
                    style={{ background: spec.color }}
                  >
                    {spec.short}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-mono-caps text-ink-mute">{spec.category}</span>
                    <span className="block truncate text-sm text-ink">{spec.label}</span>
                  </span>
                </button>
              </li>
            ))}
            {filteredCatalog.length === 0 && (
              <li className="py-6 text-center text-xs text-ink-mute">Nothing matches.</li>
            )}
          </ul>
        </div>
        <div className="border-t border-white/8 p-3">
          <div className="text-mono-caps text-ink-mute">Tip</div>
          <p className="mt-1 text-xs text-ink-dim">Drop any node onto the canvas. Drag from the right port to connect. ⌘Z undoes.</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="clay-lg relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/8 bg-space/50 px-4 py-2.5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-mono-caps text-ink-mute">
            <span className="text-ink">{projectId}</span>
            <span className="opacity-40">·</span>
            <span>{nodes.length} nodes</span>
            <span className="opacity-40">·</span>
            <span>{edges.length} edges</span>
            <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] text-success">valid</span>
          </div>
          <div className="flex items-center gap-1">
            {[
              { icon: Undo2, k: "⌘Z", l: "undo" },
              { icon: Redo2, k: "⇧⌘Z", l: "redo" },
              { icon: Grid3x3, k: "G", l: "grid" },
              { icon: Save, k: "⌘S", l: "save" },
            ].map(({ icon: Icon, l }) => (
              <button
                key={l}
                aria-label={l}
                className="clay-sm inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-mute hover:text-ink"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
            <PillButton size="sm" icon={<Play className="h-3 w-3" />}>Simulate</PillButton>
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, n) => setSelected(n as Node<CloudNodeData>)}
          onPaneClick={() => setSelected(null)}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ animated: true }}
          className="!bg-transparent"
          style={{ paddingTop: 48 }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={22}
            size={1}
            color="rgba(255,255,255,0.08)"
          />
          <MiniMap
            className="!rounded-xl !bg-space/60 !border-white/10"
            nodeColor={(n) => (n.data as CloudNodeData).color}
            nodeStrokeWidth={2}
            maskColor="rgba(5,5,5,0.65)"
          />
          <Controls
            className="!rounded-xl !bg-space/60 !border-white/10 [&>button]:!bg-transparent [&>button]:!border-white/10 [&>button]:!text-ink-dim"
          />
        </ReactFlow>

        {/* Keyboard hints ribbon */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center">
          <div className="glass pointer-events-auto flex items-center gap-4 rounded-full px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-ink-mute">
            <span>⌘K palette</span>
            <span>Space + drag pan</span>
            <span>Scroll zoom</span>
            <span>L toggle traffic</span>
          </div>
        </div>
      </div>

      {/* Inspector */}
      <div className="clay-lg flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-full flex-col"
            >
              <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                <div className="text-mono-caps text-ai">Inspector</div>
                <button
                  onClick={() => setSelected(null)}
                  className="clay-sm inline-flex h-7 w-7 items-center justify-center rounded-lg text-ink-mute hover:text-ink"
                  aria-label="Close inspector"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <div className="mb-6 flex items-center gap-3">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-2xl font-mono text-sm font-semibold text-void"
                    style={{ background: selected.data.color }}
                  >
                    {selected.data.short}
                  </span>
                  <div>
                    <div className="text-mono-caps text-ink-mute">{selected.data.provider}</div>
                    <div className="font-display text-lg font-semibold">{selected.data.label}</div>
                  </div>
                </div>

                <section className="mb-6">
                  <div className="text-mono-caps text-ink-mute mb-2">Status</div>
                  <div className="clay-sm flex items-center justify-between rounded-xl p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-2 w-2 fill-success text-success" />
                      Healthy
                    </div>
                    <span className="text-mono-caps text-ink-mute">v423</span>
                  </div>
                </section>

                <section className="mb-6">
                  <div className="text-mono-caps text-ink-mute mb-2">Configuration</div>
                  <div className="clay-inset space-y-2 rounded-xl p-4 font-mono text-xs text-ink-dim">
                    <div>region: <span className="text-ai">us-east-1</span></div>
                    <div>instance: <span className="text-ai">t3.medium</span></div>
                    <div>replicas: <span className="text-ai">3</span></div>
                    <div>encryption: <span className="text-success">enabled</span></div>
                  </div>
                </section>

                <section className="mb-6">
                  <div className="text-mono-caps text-ink-mute mb-2">Connected</div>
                  <ul className="space-y-1.5">
                    {edges
                      .filter(e => e.source === selected.id || e.target === selected.id)
                      .map(e => {
                        const other = e.source === selected.id ? e.target : e.source;
                        const otherNode = nodes.find(n => n.id === other);
                        return (
                          <li key={e.id} className="clay-sm flex items-center justify-between rounded-lg px-3 py-2 text-xs">
                            <span className="text-ink">{otherNode?.data.label ?? other}</span>
                            <ArrowRight className={cn("h-3 w-3", e.source === selected.id ? "text-ai" : "-rotate-180 text-info")} />
                          </li>
                        );
                      })}
                    {edges.filter(e => e.source === selected.id || e.target === selected.id).length === 0 && (
                      <li className="text-xs text-ink-mute">No connections yet.</li>
                    )}
                  </ul>
                </section>

                <section>
                  <div className="text-mono-caps text-ai mb-2">Council notes</div>
                  <div className="clay-sm space-y-3 rounded-xl p-4">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-aws" />
                      <span><span className="text-aws">Aria:</span> IAM role attached is fine. Encrypted at rest.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gcp" />
                      <span><span className="text-gcp">Elm:</span> Right-sized for load. No savings recommendation.</span>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col p-5"
            >
              <div className="text-mono-caps text-ink-mute mb-4">Project pulse</div>
              <div className="mb-6 flex justify-center">
                <HealthRing value={87} size={140} />
              </div>
              <div className="space-y-3">
                {[
                  { icon: Sparkles, label: "Council suggestions", value: "3 pending", tint: "text-ai" },
                  { icon: ShieldAlert, label: "Blast radius alerts", value: "2 open", tint: "text-danger" },
                  { icon: Coins, label: "Optimizations", value: "$684/mo", tint: "text-success" },
                  { icon: Boxes, label: "Drift", value: "0 nodes", tint: "text-info" },
                ].map(k => {
                  const Icon = k.icon;
                  return (
                    <div key={k.label} className="clay-sm flex items-center justify-between rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg clay-sm", k.tint)}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs text-ink-dim">{k.label}</span>
                      </div>
                      <span className="text-xs text-ink">{k.value}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 text-xs text-ink-mute">
                Click any node to open the inspector, or drop a new service from the library on the left.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function PlaygroundCanvas({ projectId }: { projectId: string }) {
  return (
    <ReactFlowProvider>
      <PlaygroundCanvasInner projectId={projectId} />
    </ReactFlowProvider>
  );
}
