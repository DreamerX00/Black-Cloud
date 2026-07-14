"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  QuadraticBezierLine,
  Sparkles,
  Text,
} from "@react-three/drei";
import * as THREE from "three";
import { PROVIDER_META } from "@/lib/nodes/registry";
import { AwsIcon3D, type AwsIconName } from "./aws-icon-3d";

/**
 * Chapter 3D scenes — one R3F canvas per chapter.
 *
 * Each scene renders extruded AWS Architecture Icons (Lambda, EC2, S3, …)
 * via <AwsIcon3D>, which reads SVGs from /aws-3d/ and extrudes them into
 * beveled 3D coins. The motion (orbit, pair, cascade, constellation) is
 * preserved from the previous drei-primitive version — only the geometry
 * changed, so the pacing/feel stays consistent.
 *
 * Lighting is deliberately bright (ambient 0.9 + two directionals) because
 * beveled extrudes go pitch-black at the previous 0.55 ambient — the icon
 * faces are near-vertical and catch almost nothing from an angled key.
 */

const SHARED_CANVAS_PROPS = {
  dpr: [1, 1.5] as [number, number],
  gl: { antialias: true, alpha: true },
  camera: { position: [0, 0, 4.5] as [number, number, number], fov: 50 },
};

function BaseLights() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#8B5CF6", "#050505", 0.5]} />
      <directionalLight position={[3, 4, 5]} intensity={0.7} />
      <directionalLight position={[-4, -2, 3]} intensity={0.4} color="#8B5CF6" />
    </>
  );
}

/* ── Chapter 1: DESIGN — orbiting AWS services around a core ────────────── */

function OrbitingIcon({
  name,
  radius,
  offset,
  size = 0.9,
}: {
  name: AwsIconName;
  radius: number;
  offset: number;
  size?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 0.35 + offset;
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.7) * 0.35,
      Math.sin(t) * radius,
    );
    ref.current.rotation.y = -t;
  });
  return (
    <group ref={ref}>
      <AwsIcon3D name={name} size={size} depth={0.12} />
    </group>
  );
}

function DesignCore() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_s, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.4;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={ref}>
        <AwsIcon3D name="lambda" size={1.4} depth={0.18} />
      </group>
    </Float>
  );
}

export function DesignScene3D() {
  // Four canonical AWS services orbiting a Lambda core — communicates
  // "designing a serverless architecture" at a glance.
  const orbits: { name: AwsIconName; offset: number }[] = [
    { name: "ec2", offset: 0 },
    { name: "s3", offset: Math.PI * 0.5 },
    { name: "rds", offset: Math.PI },
    { name: "dynamodb", offset: Math.PI * 1.5 },
  ];
  return (
    <Canvas {...SHARED_CANVAS_PROPS}>
      <BaseLights />
      <Suspense fallback={null}>
        <DesignCore />
        {orbits.map((o) => (
          <OrbitingIcon key={o.name} name={o.name} radius={2.1} offset={o.offset} size={0.75} />
        ))}
      </Suspense>
      <Sparkles count={18} scale={5} size={0.7} speed={0.25} color="#8B5CF6" />
    </Canvas>
  );
}

/* ── Chapter 2: VALIDATE — one valid service, one warning service ───────── */

function ValidateBadge({
  position,
  name,
  warn,
}: {
  position: [number, number, number];
  name: AwsIconName;
  warn?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const s = warn ? 1 + Math.sin(t * 8) * 0.04 : 1 + Math.sin(t * 1.4) * 0.03;
    ref.current.scale.setScalar(s);
  });
  return (
    <group ref={ref} position={position}>
      <AwsIcon3D
        name={name}
        size={1.1}
        depth={0.14}
        // ponytail: recolor the base to green/red instead of AWS orange for validation semantics
        bgColor={warn ? "#EF4444" : "#22C55E"}
        emissiveIntensity={warn ? 0.35 : 0.2}
      />
    </group>
  );
}

function AnimatedEdge({
  from,
  to,
  color,
  warn = false,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  warn?: boolean;
}) {
  const packetRef = useRef<THREE.Mesh>(null);
  const fromV = useMemo(() => new THREE.Vector3(...from), [from]);
  const toV = useMemo(() => new THREE.Vector3(...to), [to]);
  const mid = useMemo(
    () => new THREE.Vector3().addVectors(fromV, toV).multiplyScalar(0.5).add(new THREE.Vector3(0, 0.4, 0)),
    [fromV, toV],
  );

  useFrame(({ clock }) => {
    if (!packetRef.current) return;
    const t = (clock.elapsedTime * 0.6) % 1;
    const oneMinusT = 1 - t;
    packetRef.current.position.x =
      oneMinusT * oneMinusT * fromV.x + 2 * oneMinusT * t * mid.x + t * t * toV.x;
    packetRef.current.position.y =
      oneMinusT * oneMinusT * fromV.y + 2 * oneMinusT * t * mid.y + t * t * toV.y;
    packetRef.current.position.z =
      oneMinusT * oneMinusT * fromV.z + 2 * oneMinusT * t * mid.z + t * t * toV.z;
  });

  return (
    <>
      <QuadraticBezierLine
        start={fromV}
        end={toV}
        mid={mid}
        color={warn ? "#EF4444" : color}
        lineWidth={warn ? 2.5 : 2}
        dashed={warn}
        dashScale={30}
      />
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color={warn ? "#EF4444" : "#EDEDED"} />
      </mesh>
    </>
  );
}

export function ValidateScene3D() {
  // ALB fanout to Fargate (green, ok) and RDS (red, warning) — the two AWS
  // services users actually see fail in production.
  return (
    <Canvas {...SHARED_CANVAS_PROPS}>
      <BaseLights />
      <Suspense fallback={null}>
        <ValidateBadge position={[-1.6, 0, 0]} name="elb" />
        <ValidateBadge position={[1.6, 0.8, 0]} name="fargate" />
        <ValidateBadge position={[1.6, -0.8, 0]} name="rds" warn />
      </Suspense>

      <AnimatedEdge from={[-0.9, 0, 0]} to={[0.9, 0.8, 0]} color="#22C55E" />
      <AnimatedEdge from={[-0.9, 0, 0]} to={[0.9, -0.8, 0]} color="#EF4444" warn />

      <Sparkles count={15} scale={4} size={0.6} speed={0.2} />
    </Canvas>
  );
}

/* ── Chapter 3: EXPORT — cascading format tiles + AWS icon on each ──────── */

function FormatTile({
  position,
  color,
  label,
  iconName,
  offset,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  iconName?: AwsIconName;
  offset: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 0.5 + offset;
    ref.current.position.y = position[1] + Math.sin(t) * 0.12;
    ref.current.rotation.y = Math.sin(t * 0.6) * 0.35;
  });
  return (
    <group ref={ref} position={position}>
      {iconName ? (
        // ponytail: use the AWS icon as the "cover" so exports look tied to services
        <group position={[0, 0.15, 0]}>
          <AwsIcon3D name={iconName} size={0.9} depth={0.12} />
        </group>
      ) : (
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.7, 0.7, 0.1]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      )}
      <Text
        position={[0, -0.55, 0.06]}
        fontSize={0.22}
        color="#EDEDED"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

export function ExportScene3D() {
  // Three format tiles — .TF (Lambda), .SVG (S3), .JSON (RDS) — icon on each
  // reads as "your architecture, in these formats".
  const formats: {
    label: string;
    color: string;
    pos: [number, number, number];
    icon: AwsIconName;
    offset: number;
  }[] = [
    { label: ".TF", color: "#FF9900", pos: [-1.7, 0, 0], icon: "lambda", offset: 0 },
    { label: ".SVG", color: "#4285F4", pos: [0, 0.2, 0.3], icon: "s3", offset: 1 },
    { label: ".JSON", color: "#22C55E", pos: [1.7, 0, 0], icon: "rds", offset: 2 },
  ];
  return (
    <Canvas {...SHARED_CANVAS_PROPS}>
      <BaseLights />
      <Suspense fallback={null}>
        {formats.map((f) => (
          <FormatTile
            key={f.label}
            position={f.pos}
            color={f.color}
            label={f.label}
            iconName={f.icon}
            offset={f.offset}
          />
        ))}
      </Suspense>
      <Sparkles count={16} scale={5} size={0.6} speed={0.3} color="#4285F4" />
    </Canvas>
  );
}

/* ── Chapter 4: MULTI-CLOUD — provider constellation with AWS icons ─────── */

function ProviderCluster({
  angle,
  color,
  label,
  count,
  iconName,
}: {
  angle: number;
  color: string;
  label: string;
  count: number;
  iconName: AwsIconName;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime * 0.15;
    const r = 1.9;
    groupRef.current.position.set(
      Math.cos(angle + t) * r,
      Math.sin(angle * 1.2) * 0.4,
      Math.sin(angle + t) * r,
    );
    groupRef.current.rotation.y = -(angle + t) + Math.PI / 2;
  });
  return (
    <group ref={groupRef}>
      <AwsIcon3D name={iconName} size={0.8} depth={0.14} bgColor={color} />
      <Text position={[0, -0.6, 0]} fontSize={0.18} color={color} anchorX="center" anchorY="middle">
        {label}
      </Text>
      <Text
        position={[0, -0.82, 0]}
        fontSize={0.1}
        color="#71717a"
        anchorX="center"
        anchorY="middle"
      >
        {`${count} services`}
      </Text>
    </group>
  );
}

function CentralCore() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_s, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.6;
    }
  });
  return (
    <group ref={ref}>
      <AwsIcon3D name="cloudfront" size={0.9} depth={0.14} />
    </group>
  );
}

export function ProvidersScene3D() {
  return (
    <Canvas {...SHARED_CANVAS_PROPS}>
      <BaseLights />
      <Suspense fallback={null}>
        <CentralCore />
        <ProviderCluster
          angle={0}
          color={PROVIDER_META.aws.accent}
          label="AWS"
          count={PROVIDER_META.aws.count}
          iconName="ec2"
        />
        <ProviderCluster
          angle={(Math.PI * 2) / 3}
          color={PROVIDER_META.azure.accent}
          label="Azure"
          count={PROVIDER_META.azure.count}
          iconName="lambda"
        />
        <ProviderCluster
          angle={(Math.PI * 4) / 3}
          color={PROVIDER_META.gcp.accent}
          label="GCP"
          count={PROVIDER_META.gcp.count}
          iconName="s3"
        />
      </Suspense>
      <Sparkles count={20} scale={6} size={0.7} speed={0.25} />
    </Canvas>
  );
}
