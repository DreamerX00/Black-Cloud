"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Stars, Line, Sparkles as R3Sparkles } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Landing 5-scene sequence — VISION.md scenes 1-5, condensed into one
 * continuous R3F canvas whose narrative advances by scroll ratio (0→1).
 * Consumers pass `progress` (a MotionValue-derived 0..1 number).
 */

const SERVICES = [
  { name: "Route53", pos: [-6, 0, 0], color: "#8b5cf6" },
  { name: "CloudFront", pos: [-3, 1, 0.5], color: "#38bdf8" },
  { name: "ALB", pos: [0, -0.5, 0], color: "#ff9900" },
  { name: "ECS", pos: [3, 0.6, -0.5], color: "#22c55e" },
  { name: "RDS", pos: [6, -0.2, 0], color: "#ef4444" },
] as const;

function CloudNode({
  position,
  color,
  active,
}: {
  position: [number, number, number];
  color: string;
  active: number; // 0..1
  label: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.25;
      const s = 0.4 + active * 0.7;
      meshRef.current.scale.setScalar(s);
    }
    if (glowRef.current) {
      const p = 0.6 + Math.sin(t * 2 + position[0]) * 0.15;
      glowRef.current.scale.setScalar((0.4 + active * 0.9) * p);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.18 * active;
    }
  });
  return (
    <group position={position}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6 + active}
            roughness={0.25}
            metalness={0.85}
          />
        </mesh>
        <mesh ref={glowRef}>
          <sphereGeometry args={[1.1, 24, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      </Float>
    </group>
  );
}

function Packet({ path, offset }: { path: THREE.CatmullRomCurve3; offset: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.getElapsedTime() * 0.25 + offset) % 1);
    const p = path.getPoint(t);
    ref.current.position.copy(p);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(t * Math.PI) * 0.95;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.09, 8, 8]} />
      <meshBasicMaterial color="#a8ecff" transparent />
    </mesh>
  );
}

function ConnectionCurve({ from, to, active }: { from: [number, number, number]; to: [number, number, number]; active: number }) {
  const points = useMemo(() => {
    const mid: [number, number, number] = [
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2 + 1.4,
      (from[2] + to[2]) / 2 + 1.2,
    ];
    return [new THREE.Vector3(...from), new THREE.Vector3(...mid), new THREE.Vector3(...to)];
  }, [from, to]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const linePoints = useMemo(() => curve.getPoints(48), [curve]);

  return (
    <>
      <Line
        points={linePoints}
        color="#8b5cf6"
        transparent
        opacity={0.15 + active * 0.55}
        lineWidth={1.2}
        dashed={false}
      />
      {active > 0.4 && (
        <>
          <Packet path={curve} offset={0} />
          <Packet path={curve} offset={0.33} />
          <Packet path={curve} offset={0.66} />
        </>
      )}
    </>
  );
}

function OuterGalaxy({ opacity }: { opacity: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.02;
  });
  const rings = useMemo(() => {
    const arr: Array<{ r: number; y: number; c: string }> = [];
    for (let i = 0; i < 6; i++) {
      arr.push({
        r: 14 + i * 4,
        y: (i - 3) * 0.5,
        c: ["#8b5cf6", "#38bdf8", "#ff9900", "#22c55e", "#ef4444", "#4285f4"][i],
      });
    }
    return arr;
  }, []);
  return (
    <group ref={groupRef} visible={opacity > 0.01}>
      {rings.map((r, i) => (
        <mesh key={i} position={[0, r.y, 0]} rotation={[Math.PI / 2 + i * 0.1, 0, 0]}>
          <torusGeometry args={[r.r, 0.02, 6, 128]} />
          <meshBasicMaterial color={r.c} transparent opacity={opacity * 0.35} />
        </mesh>
      ))}
    </group>
  );
}

function SceneCamera({ progress }: { progress: number }) {
  const { camera } = useThree();
  useFrame(() => {
    // Scene 1 (0..0.2): tight on origin. Scene 5 (0.8..1): far pullback.
    // R3F pattern: per-frame camera mutation is idiomatic; the lint rule
    // discourages hook-value mutation but this is the sanctioned exception.
    const targetZ = 8 - progress * 4 + Math.pow(progress, 3) * 22;
    const targetY = progress * 3;
    const targetX = Math.sin(progress * Math.PI) * 2;
    const nx = camera.position.x + (targetX - camera.position.x) * 0.06;
    const ny = camera.position.y + (targetY - camera.position.y) * 0.05;
    const nz = camera.position.z + (targetZ - camera.position.z) * 0.05;
    camera.position.set(nx, ny, nz);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function SceneContent({ progress }: { progress: number }) {
  const nodesVisible = Math.min(1, Math.max(0, (progress - 0.05) * 6));
  // How many services are lit up
  const activeIndex = progress * SERVICES.length * 1.4;

  const nodes = SERVICES.map((s, i) => ({
    ...s,
    active: Math.max(0, Math.min(1, activeIndex - i)) * nodesVisible,
  }));

  const connections = SERVICES.slice(0, -1).map((s, i) => ({
    from: s.pos as [number, number, number],
    to: SERVICES[i + 1].pos as [number, number, number],
    active: Math.max(0, Math.min(1, activeIndex - i - 0.5)) * nodesVisible,
  }));

  const galaxyOpacity = Math.max(0, (progress - 0.55) * 2.5);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[8, 8, 8]} intensity={70} color="#8b5cf6" distance={40} />
      <pointLight position={[-8, -6, 6]} intensity={60} color="#38bdf8" distance={40} />
      <pointLight position={[0, 6, -8]} intensity={40} color="#ff9900" distance={40} />

      <Stars radius={80} depth={40} count={4000} factor={3} fade speed={0.5} />
      <R3Sparkles count={80} size={2} scale={[20, 12, 20]} speed={0.3} color="#a8b3c7" />

      {nodes.map(n => (
        <CloudNode key={n.name} position={n.pos as [number, number, number]} color={n.color} active={n.active} label={n.name} />
      ))}

      {connections.map((c, i) => (
        <ConnectionCurve key={i} from={c.from} to={c.to} active={c.active} />
      ))}

      <OuterGalaxy opacity={galaxyOpacity} />

      {/* Ground reflection plane, subtle */}
      <mesh position={[0, -3.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.4} />
      </mesh>
    </>
  );
}

export function LandingScene({ progress = 0 }: { progress?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="absolute inset-0"
    >
      <Suspense fallback={null}>
        <SceneCamera progress={progress} />
        <SceneContent progress={progress} />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

export function LandingSceneLoader() {
  const [progress, setProgress] = useState(0);

  // Drive scene progress from window scroll — 0 at top, 1 after ~4 viewport heights.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = window.innerHeight * 4;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      setProgress(p);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <LandingScene progress={progress} />;
}
