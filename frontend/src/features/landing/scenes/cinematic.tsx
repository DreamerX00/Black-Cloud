"use client";

/**
 * Cinematic — the 5-scene opening act per plan/VISION.md.
 *
 *   Scene 1  A dark digital universe. A single data packet appears.
 *   Scene 2  The packet moves along Route53 → CloudFront → ALB → ECS → RDS.
 *   Scene 3  The architecture grows into a massive interconnected network.
 *   Scene 4  Camera pulls back — the complete BlackCloud universe revealed.
 *   Scene 5  User enters the platform (CTA).
 *
 * Composition:
 *   - ONE full-viewport <Canvas> (fixed, z-0) so we never hit WebGL context caps
 *   - A sticky-scroll container drives `progress` (0..1)
 *   - `progress` maps to camera position + which scene overlay is visible
 *   - Claymorphic HUD overlays float above the canvas per scene
 *   - Reduced motion → collapses to a static wordmark hero
 */

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Stars, Float, Line, Text } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Sparkles,
  Compass,
  Network,
  Planet,
  Rocket,
} from "@/components/icons";
import { ClayBadge, ClayOrb } from "@/components/ui/clay";
import { cn } from "@/lib/utils";

/* ─── The service path — Route53 → CF → ALB → ECS → RDS ────────────────── */
const SERVICE_PATH = [
  { id: "route53", label: "Route 53", color: "#FF9900", pos: [-6, 2, 0] as const },
  { id: "cf", label: "CloudFront", color: "#FF9900", pos: [-3, 1, 0] as const },
  { id: "alb", label: "ALB", color: "#FF9900", pos: [0, 0, 0] as const },
  { id: "ecs", label: "ECS", color: "#FF9900", pos: [3, 1, 0] as const },
  { id: "rds", label: "RDS", color: "#FF9900", pos: [6, 2, 0] as const },
] as const;

/* ─── The data packet — a glowing sphere that traces the path ──────────── */
function DataPacket({ progress }: { progress: number }) {
  const ref = useRef<THREE.Mesh>(null);

  // Map the whole 5-point path onto scene-2 progress window [0.15, 0.45]
  useFrame(() => {
    if (!ref.current) return;
    // Segment progress: 0..1 across scene 2's window
    const t = THREE.MathUtils.clamp((progress - 0.15) / 0.3, 0, 1);
    // Follow the polyline
    const segCount = SERVICE_PATH.length - 1;
    const raw = t * segCount;
    const i = Math.min(Math.floor(raw), segCount - 1);
    const local = raw - i;
    const a = new THREE.Vector3(...SERVICE_PATH[i].pos);
    const b = new THREE.Vector3(...SERVICE_PATH[i + 1].pos);
    ref.current.position.lerpVectors(a, b, local);
    // Scene-1: still park it in the middle waiting
    if (progress < 0.15) {
      ref.current.position.set(0, 0, 0);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.14, 32, 32]} />
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#8b5cf6"
        emissiveIntensity={2.5}
        toneMapped={false}
      />
      {/* Halo */}
      <mesh scale={2.4}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.15} />
      </mesh>
    </mesh>
  );
}

/* ─── Service node — a floating chip that lights up when reached ──────── */
function ServiceNode({
  position,
  color,
  label,
  active,
}: {
  position: readonly [number, number, number];
  color: string;
  label: string;
  active: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = Math.sin(t * 0.4) * 0.1;
  });

  return (
    <group ref={ref} position={position}>
      <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.3}>
        {/* Chip base */}
        <mesh castShadow>
          <boxGeometry args={[1.1, 1.1, 0.16]} />
          <meshStandardMaterial
            color={active ? color : "#1a2030"}
            emissive={active ? color : "#000000"}
            emissiveIntensity={active ? 0.6 : 0}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        {/* Rim light */}
        <mesh position={[0, 0, 0.09]}>
          <ringGeometry args={[0.5, 0.53, 32]} />
          <meshBasicMaterial color={color} transparent opacity={active ? 0.9 : 0.3} />
        </mesh>
        {/* Label — drei <Text> uses SDF against a TTF (see /public/fonts). */}
        <Text
          font="/fonts/SpaceGrotesk-SemiBold.ttf"
          fontSize={0.14}
          position={[0, -0.85, 0]}
          anchorX="center"
          anchorY="middle"
          color={active ? "#ededed" : "#71717a"}
        >
          {label}
        </Text>
      </Float>
    </group>
  );
}

/* ─── Path lines connecting the services ──────────────────────────────── */
function ServicePathLines({ progress }: { progress: number }) {
  const points = SERVICE_PATH.map(
    (s) => new THREE.Vector3(s.pos[0], s.pos[1], s.pos[2]),
  );
  const opacity = THREE.MathUtils.clamp((progress - 0.1) / 0.15, 0, 1);
  return (
    <Line
      points={points}
      color="#8b5cf6"
      lineWidth={1.2}
      transparent
      opacity={opacity * 0.4}
      dashed
      dashSize={0.3}
      gapSize={0.15}
    />
  );
}

/* ─── The BlackCloud "universe" (scene 3 + 4) — orbiting node constellation */
function Constellation({ progress }: { progress: number }) {
  const ref = useRef<THREE.Group>(null);
  const nodeCount = 120;
  const positions = useRef<Array<[number, number, number]>>([]);
  if (positions.current.length === 0) {
    for (let i = 0; i < nodeCount; i++) {
      const theta = (i / nodeCount) * Math.PI * 2 * 6;
      const y = (Math.random() - 0.5) * 12;
      const r = 8 + Math.random() * 6;
      positions.current.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
    }
  }

  useFrame((state) => {
    if (!ref.current) return;
    // Only visible in scene 3+
    const visible = progress >= 0.45;
    ref.current.visible = visible;
    if (!visible) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    // Scale in as we enter scene 3
    const t = THREE.MathUtils.clamp((progress - 0.45) / 0.3, 0, 1);
    ref.current.scale.setScalar(t);
  });

  return (
    <group ref={ref}>
      {positions.current.map((p, i) => {
        const color =
          i % 3 === 0 ? "#FF9900" : i % 3 === 1 ? "#0078D4" : "#4285F4";
        return (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.85} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── Camera choreography — the pull-back that reveals the universe ─── */
function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  useFrame(() => {
    // Scene 1: close-up on packet (z=6)
    // Scene 2: pulled back a bit (z=10) so full path fits
    // Scene 3: pulled way back (z=22) — universe reveal
    // Scene 4: at the top of the cosmos (z=28, y=8)
    // Scene 5: back down (z=14) — the CTA framing
    let targetZ = 6;
    let targetY = 0;
    if (progress < 0.15) {
      targetZ = 6;
      targetY = 0;
    } else if (progress < 0.45) {
      targetZ = 10;
      targetY = 1;
    } else if (progress < 0.7) {
      targetZ = 22;
      targetY = 3;
    } else if (progress < 0.9) {
      targetZ = 28;
      targetY = 8;
    } else {
      targetZ = 14;
      targetY = 2;
    }
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, targetY * 0.3, 0);
  });
  return null;
}

/* ─── The R3F canvas — the persistent 3D layer ─────────────────────────── */
function CinematicCanvas({ progress }: { progress: number }) {
  // Which service node is "reached"?
  const reachedIdx =
    progress < 0.15
      ? -1
      : Math.min(
          Math.floor(((progress - 0.15) / 0.3) * SERVICE_PATH.length),
          SERVICE_PATH.length - 1,
        );

  return (
    <Canvas
      className="!fixed inset-0 !h-screen !w-screen"
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 15, 45]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 4, 8]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[-8, -4, 4]} intensity={0.4} color="#4285F4" />

      <Suspense fallback={null}>
        <Stars radius={80} depth={40} count={4000} factor={4} fade speed={0.5} />
        <CameraRig progress={progress} />

        {/* Scene 1+2 : path + packet */}
        <group visible={progress < 0.6}>
          <ServicePathLines progress={progress} />
          {SERVICE_PATH.map((s, i) => (
            <ServiceNode
              key={s.id}
              position={s.pos}
              color={s.color}
              label={s.label}
              active={i <= reachedIdx}
            />
          ))}
          <DataPacket progress={progress} />
        </group>

        {/* Scene 3+4 : universe */}
        <Constellation progress={progress} />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
 *  The scroll shell — drives `progress` from a tall sticky container.
 * ══════════════════════════════════════════════════════════════════════ */
export function Cinematic() {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsub = scrollYProgress.on("change", setProgress);
    return () => unsub();
  }, [scrollYProgress]);

  // Reduced motion → static hero
  if (reduce) {
    return <ReducedMotionHero />;
  }

  return (
    <section
      ref={scrollRef}
      className="relative"
      style={{ height: "500vh" }}
      aria-label="BlackCloud cinematic introduction"
    >
      {/* The persistent 3D canvas — pinned viewport-sized */}
      {mounted && (
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <CinematicCanvas progress={progress} />

          {/* Layered HUD overlays — one per scene, cross-fade based on progress */}
          <SceneOverlays progress={progress} />
        </div>
      )}
    </section>
  );
}

/* ─── Scene overlays — claymorphic HUDs ────────────────────────────────── */
function SceneOverlays({ progress }: { progress: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <SceneOne active={progress < 0.15} />
      <SceneTwo active={progress >= 0.13 && progress < 0.45} />
      <SceneThree active={progress >= 0.43 && progress < 0.7} />
      <SceneFour active={progress >= 0.68 && progress < 0.88} />
      <SceneFive active={progress >= 0.86} />
    </div>
  );
}

function OverlayFrame({
  active,
  children,
  className,
}: {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: active ? 1 : 0,
        y: active ? 0 : 20,
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center p-8 text-center",
        active && "pointer-events-auto",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/* ─── Scene 1: A dark universe. A single data packet appears. ────────── */
function SceneOne({ active }: { active: boolean }) {
  return (
    <OverlayFrame active={active}>
      <ClayBadge tone="ai" pulse className="mb-6">
        <Sparkles className="size-3" />
        BlackCloud v1.0
      </ClayBadge>
      <motion.h1
        className="font-display text-6xl font-semibold tracking-[-0.04em] tablet:text-8xl desktop:text-[10rem] leading-[0.92]"
        initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
        animate={{
          opacity: active ? 1 : 0,
          y: active ? 0 : 40,
          filter: active ? "blur(0px)" : "blur(20px)",
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        The cloud, <br />
        <span className="italic text-gradient-provider">visualized.</span>
      </motion.h1>
      <p className="mt-8 max-w-xl text-lg text-ink-muted">
        A single packet. A living universe. Watch how BlackCloud turns
        infrastructure into an experience.
      </p>
      <motion.div
        className="mt-14 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-ink-dim font-mono"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span>Scroll to enter</span>
        <span className="text-lg">↓</span>
      </motion.div>
    </OverlayFrame>
  );
}

/* ─── Scene 2: Route53 → CloudFront → ALB → ECS → RDS ─────────────────── */
function SceneTwo({ active }: { active: boolean }) {
  return (
    <OverlayFrame active={active} className="justify-start pt-32">
      <ClayBadge tone="aws" className="mb-6">
        <Network className="size-3" />
        Scene 02 · Anatomy of a request
      </ClayBadge>
      <h2 className="font-display text-4xl font-semibold tracking-[-0.03em] tablet:text-6xl leading-[0.95]">
        One packet. <br />
        <span className="text-ai-bright">Five services.</span>
      </h2>
      <p className="mt-6 max-w-md text-base text-ink-muted">
        Route 53 resolves. CloudFront edges. The load balancer routes. ECS
        computes. RDS stores. Every hop is <em>visible</em>, not documented.
      </p>
    </OverlayFrame>
  );
}

/* ─── Scene 3: The architecture grows into a network ───────────────────── */
function SceneThree({ active }: { active: boolean }) {
  return (
    <OverlayFrame active={active} className="justify-end pb-40">
      <ClayBadge tone="ai" className="mb-6">
        <Compass className="size-3" />
        Scene 03 · The graph is the product
      </ClayBadge>
      <h2 className="font-display text-4xl font-semibold tracking-[-0.03em] tablet:text-6xl leading-[0.95]">
        One graph. <br />
        <span className="text-ai-bright">Every provider.</span>
      </h2>
      <p className="mt-6 max-w-md text-base text-ink-muted">
        Cost, security, resilience, drift — all live on the same graph, in
        the same frame. Move a node; every score updates.
      </p>
    </OverlayFrame>
  );
}

/* ─── Scene 4: Camera pulls back — universe revealed ──────────────────── */
function SceneFour({ active }: { active: boolean }) {
  return (
    <OverlayFrame active={active} className="justify-start pt-16">
      <ClayBadge tone="gcp" className="mb-6">
        <Planet className="size-3" />
        Scene 04 · The universe
      </ClayBadge>
      <h2 className="font-display text-5xl font-semibold tracking-[-0.03em] tablet:text-7xl leading-[0.95]">
        <span className="text-gradient-provider">Own</span> the graph.
      </h2>
      <p className="mt-6 max-w-xl text-lg text-ink-muted">
        Own the decision. Own the category. Every cloud service, every
        connection, every dollar — one intelligent surface.
      </p>
    </OverlayFrame>
  );
}

/* ─── Scene 5: Enter the platform ──────────────────────────────────────── */
function SceneFive({ active }: { active: boolean }) {
  return (
    <OverlayFrame active={active}>
      <ClayOrb size="xl" tone="ai" className="mb-8">
        <Rocket className="size-16" />
      </ClayOrb>
      <h2 className="font-display text-5xl font-semibold tracking-[-0.03em] tablet:text-7xl">
        Ready to build?
      </h2>
      <p className="mt-6 max-w-md text-base text-ink-muted">
        Start free. No credit card. First architecture in under 60 seconds.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/signup"
          data-magnetic
          className={cn(
            "clay clay-bump group inline-flex items-center gap-2",
            "rounded-clay-sm bg-gradient-to-br from-ai to-azure",
            "px-8 py-4 text-base font-semibold text-void shadow-clay-ai",
          )}
        >
          Enter BlackCloud
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/playground"
          data-magnetic
          className={cn(
            "clay clay-bump rounded-clay-sm border border-white/10",
            "bg-white/[0.02] px-8 py-4 text-base font-medium text-ink",
            "hover:bg-white/[0.06]",
          )}
        >
          Try the playground
        </Link>
      </div>
    </OverlayFrame>
  );
}

/* ─── Reduced-motion fallback — a static hero, still on-brand ──────────── */
function ReducedMotionHero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 aurora" />
      <div className="relative z-10 max-w-3xl text-center">
        <ClayBadge tone="ai" className="mb-8">
          <Sparkles className="size-3" />
          BlackCloud v1.0
        </ClayBadge>
        <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] tablet:text-7xl">
          The cloud,{" "}
          <span className="italic text-gradient-provider">visualized.</span>
        </h1>
        <p className="mt-6 text-lg text-ink-muted">
          Design, validate, simulate, and migrate multi-cloud infrastructure —
          before a single resource exists.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="clay clay-bump rounded-clay-sm bg-gradient-to-br from-ai to-azure px-6 py-3 text-sm font-semibold text-void shadow-clay-ai"
          >
            Start free
          </Link>
          <Link
            href="/playground"
            className="clay clay-bump rounded-clay-sm border border-white/10 bg-white/[0.02] px-6 py-3 text-sm font-medium text-ink"
          >
            Try the playground
          </Link>
        </div>
      </div>
    </section>
  );
}
