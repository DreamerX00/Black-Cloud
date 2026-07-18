"use client";

import { useState, useRef, useEffect, type ComponentType } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  Workflow,
  Brain,
  ArrowRightLeft,
  Zap,
  History,
  DollarSign,
  ChevronRight,
  Play,
  Check,
  X as XIcon,
  AlertTriangle,
  Sparkles,
  Shield,
  Mail,
  ArrowRight,
  Quote,
  Layers,
  Target,
  Rocket,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STATS,
  PRICING_PLANS,
  FAQ_ITEMS,
  TESTIMONIALS,
  SERVICES_CATALOG,
} from "@/lib/mock/index";
import { CATALOG, getServicesByProvider } from "@/lib/catalog/nodes";
import { PROVIDER_ICON, ServiceIcon } from "@/lib/brand-icons";
import { Navbar } from "@/components/nav/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { ClayPanel } from "@/components/layout/clay-panel";
import { SectionReveal, RevealItem } from "@/components/layout/section-reveal";
import { Aurora } from "@/components/effects/aurora";
import { GridBackground } from "@/components/effects/grid-background";
import { GlowOrb } from "@/components/effects/glow-orb";
import { ScanLine } from "@/components/effects/scan-line";
import { NumberTicker } from "@/components/effects/number-ticker";
import { TextReveal } from "@/components/effects/text-reveal";
import { Particles } from "@/components/effects/particles";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    title: "Cloud Playground",
    description:
      "Drag-and-drop cloud services onto an infinite canvas. Connect, configure, and visualize your entire infrastructure in real-time.",
    icon: Workflow,
    color: "#8B5CF6",
    gradient: "from-violet-500/20 to-purple-600/20",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "AI Architect",
    description:
      "Describe your workload in natural language and watch as AI generates production-grade architectures from 100K+ deployment patterns.",
    icon: Brain,
    color: "#06B6D4",
    gradient: "from-cyan-500/20 to-blue-600/20",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Migration Ground",
    description:
      "Visualize migration paths between cloud providers with compatibility scores and step-by-step guidance.",
    icon: ArrowRightLeft,
    color: "#F59E0B",
    gradient: "from-amber-500/20 to-orange-600/20",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Failure Simulator",
    description:
      "Inject failures into your architecture to test resilience. See exactly how your system responds to outages before they happen.",
    icon: Zap,
    color: "#EF4444",
    gradient: "from-red-500/20 to-rose-600/20",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Time Machine",
    description:
      "Snapshot, diff, and restore any version of your infrastructure. Branch and merge changes like code.",
    icon: History,
    color: "#22C55E",
    gradient: "from-emerald-500/20 to-green-600/20",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Cost Intelligence",
    description:
      "Real-time cost estimation as you build. Compare pricing across providers and get AI-powered savings recommendations.",
    icon: DollarSign,
    color: "#A855F7",
    gradient: "from-purple-500/20 to-fuchsia-600/20",
    span: "md:col-span-2 md:row-span-1",
  },
] as const;

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Design",
    description:
      "Drag cloud services onto your canvas, connect them visually, and configure every detail. AI suggests optimal architectures as you build.",
    icon: Layers,
  },
  {
    step: 2,
    title: "Validate",
    description:
      "One-click infrastructure validation catches misconfigurations, security issues, and cost inefficiencies before you deploy.",
    icon: Target,
  },
  {
    step: 3,
    title: "Deploy",
    description:
      "Export production-ready Terraform, CloudFormation, or Pulumi code. Integrate with CI/CD pipelines for automated deployments.",
    icon: Rocket,
  },
] as const;

// ponytail: mock canvas nodes for the teaser — pure data, no library
const CANVAS_NODES = [
  { id: "lb", label: "Load Balancer", x: 50, y: 30, color: "#8B5CF6" },
  { id: "api", label: "API Gateway", x: 50, y: 55, color: "#06B6D4" },
  { id: "fn1", label: "Lambda", x: 25, y: 80, color: "#F59E0B" },
  { id: "fn2", label: "ECS", x: 75, y: 80, color: "#22C55E" },
  { id: "db", label: "RDS", x: 35, y: 105, color: "#EF4444" },
  { id: "cache", label: "Redis", x: 65, y: 105, color: "#DC382D" },
];

const CANVAS_EDGES = [
  ["lb", "api"],
  ["api", "fn1"],
  ["api", "fn2"],
  ["fn1", "db"],
  ["fn2", "cache"],
  ["fn2", "db"],
];

// ─────────────────────────────────────────────────────────────
// Marquee row component
// ─────────────────────────────────────────────────────────────

function MarqueeRow({
  items,
  reverse = false,
  speed = 40,
}: {
  items: typeof CATALOG;
  reverse?: boolean;
  speed?: number;
}) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#0B0F17] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#0B0F17] to-transparent" />
      <div
        className={cn(
          "flex w-max gap-4 py-2",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
      >
        {doubled.map((s, i) => (
          <div
            key={`${s.id}-${i}`}
            className="clay-card flex items-center gap-3 px-4 py-3 shrink-0"
          >
            {s.icon ? (
              <Image src={s.icon} alt={s.name} width={24} height={24} />
            ) : (
              <ServiceIcon provider={s.provider} size={24} />
            )}
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {s.name}
            </span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee ${speed}s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse ${speed}s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee,
          .animate-marquee-reverse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Canvas teaser (pure SVG animation)
// ─────────────────────────────────────────────────────────────

function CanvasTeaser() {
  const nodeMap = Object.fromEntries(CANVAS_NODES.map((n) => [n.id, n]));

  return (
    <div className="relative w-full aspect-[16/9] max-w-3xl mx-auto">
      <svg
        viewBox="0 0 100 130"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Edges with animated dash */}
        {CANVAS_EDGES.map(([from, to], i) => {
          const a = nodeMap[from];
          const b = nodeMap[to];
          return (
            <line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(139,92,246,0.4)"
              strokeWidth="0.4"
              strokeDasharray="2 1"
              className="animate-edge-flow"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          );
        })}
        {/* Nodes */}
        {CANVAS_NODES.map((n) => (
          <g key={n.id}>
            {/* Glow */}
            <circle cx={n.x} cy={n.y} r="5" fill={n.color} opacity="0.15" />
            {/* Node body */}
            <rect
              x={n.x - 12}
              y={n.y - 4}
              width="24"
              height="8"
              rx="2"
              fill="rgba(22,27,34,0.9)"
              stroke={n.color}
              strokeWidth="0.4"
            />
            <text
              x={n.x}
              y={n.y + 1.5}
              textAnchor="middle"
              fill="white"
              fontSize="2.8"
              fontFamily="monospace"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <style jsx>{`
        @keyframes edge-flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -30; }
        }
        .animate-edge-flow {
          animation: edge-flow 3s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-edge-flow { animation: none; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Validation showcase
// ─────────────────────────────────────────────────────────────

function ValidationShowcase() {
  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setFixed((v) => !v), 3000);
    return () => clearInterval(interval);
  }, []);

  const errors = [
    { msg: "S3 bucket missing encryption", line: 3 },
    { msg: "Security group allows 0.0.0.0/0 on port 22", line: 7 },
    { msg: "RDS instance has no multi-AZ failover", line: 12 },
  ];

  return (
    <div className="clay-panel p-6 max-w-2xl mx-auto overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-amber-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-xs text-muted-foreground font-mono ml-2">
          infrastructure-validation.log
        </span>
        <div className="ml-auto">
          <Badge variant={fixed ? "success" : "destructive"}>
            {fixed ? "All Passed" : "3 Issues"}
          </Badge>
        </div>
      </div>
      <div className="space-y-2 font-mono text-xs">
        {errors.map((e, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: 1,
              backgroundColor: fixed
                ? "rgba(34,197,94,0.08)"
                : "rgba(239,68,68,0.08)",
            }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/5"
          >
            <AnimatePresence mode="wait">
              {fixed ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-400"
                >
                  <Check className="h-3.5 w-3.5" />
                </motion.div>
              ) : (
                <motion.div
                  key="x"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-red-400"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="text-muted-foreground">
              Line {e.line}:
            </span>
            <span
              className={cn(
                fixed ? "text-green-400 line-through" : "text-red-400"
              )}
            >
              {e.msg}
            </span>
            {fixed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-green-400 ml-auto"
              >
                Fixed
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Testimonial carousel
// ─────────────────────────────────────────────────────────────

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {[current, (current + 1) % total].map((idx) => {
              const t = TESTIMONIALS[idx];
              return (
                <ClayPanel
                  key={t.author}
                  className="p-6 md:p-8"
                  hoverable
                >
                  <Quote className="h-8 w-8 text-violet-500/30 mb-4" />
                  <p className="text-foreground leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                      {t.author
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {t.author}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.role}, {t.company}
                      </p>
                    </div>
                  </div>
                </ClayPanel>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => setCurrent((c) => (c - 1 + total) % total)}
          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-muted-foreground"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === current
                ? "w-6 bg-violet-500"
                : "w-2 bg-white/20 hover:bg-white/40"
            )}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
        <button
          onClick={() => setCurrent((c) => (c + 1) % total)}
          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-muted-foreground"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Catalog tabs
// ─────────────────────────────────────────────────────────────

function CatalogSection() {
  const providers = ["aws", "gcp", "azure"] as const;

  return (
    <Tabs defaultValue="aws" className="w-full">
      <TabsList className="mx-auto flex w-fit">
        {providers.map((p) => {
          const entry = PROVIDER_ICON[p];
          return (
            <TabsTrigger key={p} value={p} className="gap-2">
              <ServiceIcon provider={p} size={16} />
              {entry.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {providers.map((p) => {
        const services = getServicesByProvider(p).slice(0, 12);
        return (
          <TabsContent key={p} value={p}>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {services.map((s) => (
                <motion.div
                  key={s.id}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="clay-card p-4 flex flex-col items-center gap-2 text-center group cursor-pointer"
                >
                  {s.icon ? (
                    <Image
                      src={s.icon}
                      alt={s.name}
                      width={32}
                      height={32}
                      className="opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <ServiceIcon provider={s.provider} size={32} />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {s.name}
                  </span>
                  <span className="text-xs text-muted-foreground line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {s.description}
                  </span>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

// ─────────────────────────────────────────────────────────────
// Main homepage
// ─────────────────────────────────────────────────────────────

export default function HomeClient() {
  // ponytail: true runtime-only import — no static reference to Three.js
  // so Turbopack never resolves the three/R3F tree at compile time
  const [Scene, setScene] = useState<ComponentType | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      import("./_home-3d").then((m) => setScene(() => m.default));
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  // Split catalog into two rows for marquee
  const halfCat = Math.ceil(CATALOG.length / 2);
  const marqueeRow1 = CATALOG.slice(0, halfCat);
  const marqueeRow2 = CATALOG.slice(halfCat);

  return (
    <div className="relative min-h-screen bg-[#0B0F17] text-foreground overflow-x-hidden">
      {/* ============================================================
          1. HERO SECTION
          ============================================================ */}
      <Navbar />
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      >
        {/* Background layers */}
        {Scene && <Scene />}
        <Aurora intensity="high" />
        <GridBackground variant="dots" />
        <ScanLine speed={10} />
        <GlowOrb
          color="rgba(139,92,246,0.25)"
          size={400}
          className="left-[10%] top-[20%]"
        />
        <GlowOrb
          color="rgba(6,182,212,0.2)"
          size={350}
          className="right-[10%] top-[40%]"
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Badge className="mb-6 text-xs" variant="outline">
              <Sparkles className="h-3 w-3 mr-1" />
              Now with AI Architecture Advisor
            </Badge>
          </motion.div>

          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <TextReveal
              text="Design Your"
              variant="word"
              className="text-gradient"
            />
            <br />
            <TextReveal
              text="Cloud Universe"
              variant="word"
              className="text-foreground"
              delay={0.3}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed"
          >
            The most immersive cloud infrastructure designer. Build, visualize,
            and manage your entire cloud architecture in a living, breathing
            digital universe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <MagneticButton>
              <Button size="lg" className="clay-button text-base px-8" asChild>
                <Link href="/playground">
                  Enter the Universe
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button
                variant="ghost"
                size="lg"
                className="text-base gap-2 border border-white/10"
              >
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </MagneticButton>
          </motion.div>

          {/* Provider logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 flex items-center justify-center gap-8 opacity-60"
          >
            {(["aws", "azure", "gcp"] as const).map((p) => (
              <div
                key={p}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <ServiceIcon provider={p} size={24} />
                <span className="text-sm font-medium hidden sm:inline">
                  {PROVIDER_ICON[p].label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ============================================================
          2. TRUST BAR / STATS BAND
          ============================================================ */}
      <section className="relative py-16 px-6">
        <SectionReveal>
          <ClayPanel className="mx-auto max-w-6xl p-8 md:p-12 glass">
            <p className="text-center text-sm text-muted-foreground mb-8 font-medium tracking-wide uppercase">
              Trusted by 8,000+ cloud engineers worldwide
            </p>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                {
                  label: "Projects Designed",
                  value: STATS.totalProjects,
                  suffix: "+",
                },
                {
                  label: "Cloud Nodes Placed",
                  value: STATS.totalNodes,
                  suffix: "+",
                },
                {
                  label: "AI Generations",
                  value: STATS.aiGenerations,
                  suffix: "+",
                },
                {
                  label: "Cost Saved",
                  value: STATS.costSaved,
                  prefix: "$",
                  suffix: "",
                },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold font-display text-gradient">
                    <NumberTicker
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      duration={2500}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </ClayPanel>
        </SectionReveal>
      </section>

      {/* ============================================================
          3. PROVIDER MARQUEE
          ============================================================ */}
      <section className="py-12 px-6">
        <SectionReveal>
          <div className="mx-auto max-w-7xl space-y-4">
            <p className="text-center text-sm text-muted-foreground mb-6">
              Supporting{" "}
              <span className="text-foreground font-medium">
                {CATALOG.length}+
              </span>{" "}
              cloud services across all major providers
            </p>
            <MarqueeRow items={marqueeRow1} speed={50} />
            <MarqueeRow items={marqueeRow2} reverse speed={45} />
          </div>
        </SectionReveal>
      </section>

      {/* ============================================================
          4. BENTO FEATURES GRID
          ============================================================ */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <SectionReveal className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Features
            </Badge>
            <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl text-gradient">
              Everything you need to design
              <br />
              world-class infrastructure
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Six powerful tools that transform how you architect, validate, and
              deploy cloud infrastructure.
            </p>
          </SectionReveal>

          <SectionReveal stagger={0.08} className="grid gap-4 md:grid-cols-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <RevealItem key={f.title} className={f.span}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={cn(
                      "clay-card h-full p-6 md:p-8 relative overflow-hidden group cursor-pointer transition-all duration-300",
                      "hover:border-violet-500/20"
                    )}
                  >
                    {/* Background gradient */}
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
                        f.gradient
                      )}
                    />
                    {/* Hover glow */}
                    <div
                      className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle, ${f.color}40, transparent 70%)`,
                      }}
                    />
                    <div className="relative z-10">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-white/5"
                        style={{
                          background: `${f.color}15`,
                          boxShadow: `0 0 20px ${f.color}10`,
                        }}
                      >
                        <Icon
                          className="h-6 w-6"
                          style={{ color: f.color }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 font-display">
                        {f.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </motion.div>
                </RevealItem>
              );
            })}
          </SectionReveal>
        </div>
      </section>

      {/* ============================================================
          5. INTERACTIVE CANVAS TEASER
          ============================================================ */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <SectionReveal className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold sm:text-4xl text-foreground">
              Your infrastructure, <span className="text-gradient">alive</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Watch your cloud architecture come to life on an infinite,
              interactive canvas.
            </p>
          </SectionReveal>

          <SectionReveal variant="scale">
            <ClayPanel className="p-6 md:p-10 relative overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="ml-4 flex-1 h-7 rounded-lg bg-white/5 flex items-center px-3">
                  <span className="text-xs text-muted-foreground font-mono">
                    blackcloud.app/playground/production-api
                  </span>
                </div>
              </div>

              <CanvasTeaser />

              <div className="mt-6 text-center">
                <MagneticButton>
                  <Button
                    variant="outline"
                    className="gap-2"
                    asChild
                  >
                    <Link href="/playground">
                      Try the playground
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </MagneticButton>
              </div>
            </ClayPanel>
          </SectionReveal>
        </div>
      </section>

      {/* ============================================================
          6. HOW IT WORKS
          ============================================================ */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <SectionReveal className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              How It Works
            </Badge>
            <h2 className="font-display text-3xl font-bold sm:text-4xl text-foreground">
              From idea to infrastructure{" "}
              <span className="text-gradient">in minutes</span>
            </h2>
          </SectionReveal>

          <SectionReveal stagger={0.15} className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-cyan-500/50 to-emerald-500/50 hidden md:block" />

            <div className="space-y-12">
              {HOW_IT_WORKS.map((step) => {
                const Icon = step.icon;
                const colors = [
                  "from-violet-500 to-purple-600",
                  "from-cyan-500 to-blue-600",
                  "from-emerald-500 to-green-600",
                ];
                return (
                  <RevealItem key={step.step} variant="fade-left">
                    <div className="flex gap-6 md:gap-8 items-start">
                      {/* Step number */}
                      <div
                        className={cn(
                          "shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center relative z-10",
                          colors[step.step - 1]
                        )}
                        style={{
                          boxShadow: `0 0 30px rgba(139,92,246,0.2)`,
                        }}
                      >
                        <span className="text-2xl font-bold text-white font-display">
                          {step.step}
                        </span>
                      </div>
                      {/* Content */}
                      <ClayPanel className="flex-1 p-6" hoverable>
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="h-5 w-5 text-violet-400" />
                          <h3 className="text-xl font-semibold text-foreground font-display">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </ClayPanel>
                    </div>
                  </RevealItem>
                );
              })}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ============================================================
          7. VALIDATION SHOWCASE
          ============================================================ */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <SectionReveal className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Shield className="h-3 w-3 mr-1" />
              Validation Engine
            </Badge>
            <h2 className="font-display text-3xl font-bold sm:text-4xl text-foreground">
              Catch issues{" "}
              <span className="text-gradient">before they ship</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Real-time infrastructure validation catches misconfigurations,
              security vulnerabilities, and cost inefficiencies automatically.
            </p>
          </SectionReveal>

          <SectionReveal variant="scale">
            <ValidationShowcase />
          </SectionReveal>
        </div>
      </section>

      {/* ============================================================
          8. TESTIMONIALS
          ============================================================ */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <SectionReveal className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="font-display text-3xl font-bold sm:text-4xl text-foreground">
              Loved by{" "}
              <span className="text-gradient">cloud engineers</span>
            </h2>
          </SectionReveal>

          <SectionReveal>
            <TestimonialCarousel />
          </SectionReveal>
        </div>
      </section>

      {/* ============================================================
          9. CATALOG TABS
          ============================================================ */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <SectionReveal className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Service Catalog
            </Badge>
            <h2 className="font-display text-3xl font-bold sm:text-4xl text-foreground">
              Every service,{" "}
              <span className="text-gradient">every provider</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Browse {CATALOG.length}+ services across AWS, Azure, and Google
              Cloud. Drag any service straight onto your canvas.
            </p>
          </SectionReveal>

          <SectionReveal>
            <CatalogSection />
          </SectionReveal>
        </div>
      </section>

      {/* ============================================================
          10. FAQ SECTION
          ============================================================ */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <SectionReveal className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              FAQ
            </Badge>
            <h2 className="font-display text-3xl font-bold sm:text-4xl text-foreground">
              Frequently asked{" "}
              <span className="text-gradient">questions</span>
            </h2>
          </SectionReveal>

          <SectionReveal>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Split into two columns */}
              {[
                FAQ_ITEMS.slice(0, Math.ceil(FAQ_ITEMS.length / 2)),
                FAQ_ITEMS.slice(Math.ceil(FAQ_ITEMS.length / 2)),
              ].map((col, ci) => (
                <ClayPanel key={ci} className="p-4 md:p-6">
                  <Accordion type="multiple">
                    {col.map((faq, fi) => (
                      <AccordionItem
                        key={fi}
                        value={`faq-${ci}-${fi}`}
                      >
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ClayPanel>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ============================================================
          11. PRICING PREVIEW
          ============================================================ */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <SectionReveal className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Pricing
            </Badge>
            <h2 className="font-display text-3xl font-bold sm:text-4xl text-foreground">
              Simple, transparent{" "}
              <span className="text-gradient">pricing</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Start free, upgrade when you need more power.
            </p>
          </SectionReveal>

          <SectionReveal
            stagger={0.1}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {PRICING_PLANS.map((plan) => (
              <RevealItem key={plan.name} variant="scale">
                <motion.div
                  whileHover={{ y: -6 }}
                  className={cn(
                    "clay-card h-full p-6 md:p-8 flex flex-col relative",
                    plan.highlighted &&
                      "ring-2 ring-violet-500/50 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-violet-500 text-white border-0 shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-foreground font-display">
                    {plan.name}
                  </h3>
                  <div className="mt-3 mb-1">
                    <span className="text-4xl font-bold font-display text-foreground">
                      {typeof plan.price === "number"
                        ? `$${plan.price}`
                        : plan.price}
                    </span>
                    {typeof plan.price === "number" && plan.price > 0 && (
                      <span className="text-sm text-muted-foreground ml-1">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    {plan.description}
                  </p>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full"
                    asChild
                  >
                    <Link href="/pricing">{plan.cta}</Link>
                  </Button>
                </motion.div>
              </RevealItem>
            ))}
          </SectionReveal>

          <SectionReveal className="text-center mt-8">
            <Link
              href="/pricing"
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors inline-flex items-center gap-1"
            >
              View full pricing details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* ============================================================
          12. CLOSING CTA
          ============================================================ */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-cyan-500/5" />
        <div className="absolute inset-0">
          <Particles particleCount={50} />
        </div>

        <SectionReveal className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-bold sm:text-5xl md:text-6xl text-foreground">
              Ready to enter the
              <br />
              <span className="text-gradient">cloud universe?</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Join 8,000+ engineers who design, validate, and deploy
              infrastructure visually. Start for free, no credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-12 text-base"
              />
              <MagneticButton>
                <Button
                  size="lg"
                  className="clay-button whitespace-nowrap w-full sm:w-auto"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </MagneticButton>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Free forever for personal use. No credit card required.
            </p>
          </div>
        </SectionReveal>
      </section>

      {/* ============================================================
          13. FOOTER
          ============================================================ */}
      <SiteFooter />
    </div>
  );
}
