"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

/**
 * AwsIcon3D — extrudes an AWS Architecture Icon SVG into a 3D "coin":
 *   ┌──────────────────┐
 *   │  ▓▓▓  ▓▓▓  ▓▓▓   │  ← white glyph, extruded deeper
 *   │ ▓▓▓ [λ] ▓▓▓ ▓▓▓  │
 *   │  ▓▓▓  ▓▓▓  ▓▓▓   │  ← colored background rect, thin base
 *   └──────────────────┘
 *
 * The AWS icon anatomy is consistent across the pack: a coloured background
 * `<rect>` + one or more white `<path>` glyphs. We parse subpaths, split
 * background from glyph by fill colour, extrude both at different depths,
 * and center the whole thing at the origin so scenes can just plop it in
 * with a `<group position={...}>`.
 *
 * Icons live at `/aws-3d/<name>.svg` (staged copies of the official pack).
 */

const ICON_URL: Record<AwsIconName, string> = {
  lambda: "/aws-3d/lambda.svg",
  ec2: "/aws-3d/ec2.svg",
  s3: "/aws-3d/s3.svg",
  rds: "/aws-3d/rds.svg",
  dynamodb: "/aws-3d/dynamodb.svg",
  aurora: "/aws-3d/aurora.svg",
  apigw: "/aws-3d/apigw.svg",
  cloudfront: "/aws-3d/cloudfront.svg",
  route53: "/aws-3d/route53.svg",
  elb: "/aws-3d/elb.svg",
  fargate: "/aws-3d/fargate.svg",
  shield: "/aws-3d/shield.svg",
  waf: "/aws-3d/waf.svg",
};

export type AwsIconName =
  | "lambda"
  | "ec2"
  | "s3"
  | "rds"
  | "dynamodb"
  | "aurora"
  | "apigw"
  | "cloudfront"
  | "route53"
  | "elb"
  | "fargate"
  | "shield"
  | "waf";

type ParsedIcon = {
  bgShapes: THREE.Shape[];
  bgColor: string;
  glyphShapes: THREE.Shape[];
  glyphColor: string;
  viewBox: { width: number; height: number };
};

/**
 * Two-tier cache: `resolved` holds the parsed icon once ready (synchronous
 * hits after first load), `pending` holds the in-flight promise so concurrent
 * mounts share one fetch. React 19's `use()` refuses promises created inside
 * hooks unless a framework tracks them — so we go back to the classic Suspense
 * pattern: throw the promise, and it's caught by R3F's `<Suspense>` boundary
 * exactly like drei's `useGLTF` / `useTexture` do internally.
 */
const resolved = new Map<AwsIconName, ParsedIcon>();
const pending = new Map<AwsIconName, Promise<ParsedIcon>>();

function parseSvg(text: string): ParsedIcon {
  const loader = new SVGLoader();
  const data = loader.parse(text);

  const vbMatch = text.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
  const width = vbMatch ? parseFloat(vbMatch[1]) : 80;
  const height = vbMatch ? parseFloat(vbMatch[2]) : 80;

  const bgShapes: THREE.Shape[] = [];
  const glyphShapes: THREE.Shape[] = [];
  let bgColor = "#232F3E";
  let glyphColor = "#FFFFFF";

  for (const path of data.paths) {
    // SVGLoader normalizes `"white"` / `"#fff"` / `"#FFFFFF"` into path.color,
    // so reading the hex handles apigw.svg (`fill="white"`) the same as the rest.
    const hex = path.color.getHex();
    const style = (path.userData as { style?: { fill?: string } } | undefined)?.style;
    const rawFill = style?.fill;
    const shapes = path.toShapes(true);
    if (hex === 0xffffff) {
      glyphColor = "#FFFFFF";
      glyphShapes.push(...shapes);
    } else if (rawFill && rawFill !== "none") {
      bgColor = `#${path.color.getHexString()}`;
      bgShapes.push(...shapes);
    } else {
      glyphShapes.push(...shapes);
    }
  }

  return { bgShapes, bgColor, glyphShapes, glyphColor, viewBox: { width, height } };
}

/**
 * Classic Suspense pattern: on first call, kick off the fetch and throw the
 * promise; R3F's `<Suspense>` catches it and re-renders on resolve. Subsequent
 * calls hit the `resolved` cache synchronously. No React-19 `use()` warning
 * because the promise never enters a hook boundary React polices.
 */
function useAwsIcon(name: AwsIconName): ParsedIcon {
  const hit = resolved.get(name);
  if (hit) return hit;

  let p = pending.get(name);
  if (!p) {
    p = fetch(ICON_URL[name])
      .then((r) => r.text())
      .then((text) => {
        const parsed = parseSvg(text);
        resolved.set(name, parsed);
        pending.delete(name);
        return parsed;
      });
    pending.set(name, p);
  }
  throw p;
}

/**
 * <AwsIcon3D name="lambda" size={1.2} depth={0.15} />
 *
 * Renders the icon centered at (0,0,0), fitting inside a `size × size × depth`
 * box. Glyphs sit slightly proud of the coloured base so they catch light.
 */
export function AwsIcon3D({
  name,
  size = 1,
  depth = 0.1,
  glyphColor,
  bgColor,
  metalness = 0.5,
  roughness = 0.35,
  emissiveIntensity = 0.15,
}: {
  name: AwsIconName;
  size?: number;
  depth?: number;
  glyphColor?: string;
  bgColor?: string;
  metalness?: number;
  roughness?: number;
  emissiveIntensity?: number;
}) {
  const icon = useAwsIcon(name);

  const built = useMemo(() => {
    const { width, height, ...rest } = icon.viewBox;
    void rest;
    const scale = size / Math.max(width, height);
    const bgDepth = depth * 0.4;
    const glyphDepth = depth;

    const bgGeoms = icon.bgShapes.map(
      (s) =>
        new THREE.ExtrudeGeometry(s, {
          depth: bgDepth,
          bevelEnabled: true,
          bevelThickness: bgDepth * 0.15,
          bevelSize: bgDepth * 0.15,
          bevelSegments: 2,
        }),
    );
    const glyphGeoms = icon.glyphShapes.map(
      (s) =>
        new THREE.ExtrudeGeometry(s, {
          depth: glyphDepth,
          bevelEnabled: true,
          bevelThickness: glyphDepth * 0.1,
          bevelSize: glyphDepth * 0.08,
          bevelSegments: 2,
        }),
    );
    return { bgGeoms, glyphGeoms, scale, width, height, bgColor: icon.bgColor, glyphColor: icon.glyphColor };
  }, [icon, size, depth]);

  const { bgGeoms, glyphGeoms, scale, width, height } = built;
  const bg = bgColor ?? built.bgColor;
  const glyph = glyphColor ?? built.glyphColor;

  // SVG Y-down → three.js Y-up: mirror on Y. Also center in the XY plane.
  return (
    <group
      scale={[scale, -scale, scale]}
      position={[-(width * scale) / 2, (height * scale) / 2, 0]}
    >
      {bgGeoms.map((g, i) => (
        <mesh key={`bg-${i}`} geometry={g}>
          <meshStandardMaterial
            color={bg}
            metalness={metalness}
            roughness={roughness}
            emissive={bg}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      ))}
      {glyphGeoms.map((g, i) => (
        <mesh key={`gl-${i}`} geometry={g} position={[0, 0, depth * 0.4]}>
          <meshStandardMaterial
            color={glyph}
            metalness={0.2}
            roughness={0.35}
            emissive={glyph}
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}
