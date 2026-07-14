"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Nebula shader — a full-screen animated backdrop.
 *
 * Uses a custom GLSL fragment (fBm noise → color warp) applied to a plane
 * that fills the viewport at the camera's clip space. No lighting, one
 * draw call, cheap on mobile. The uTime uniform is advanced per-frame.
 *
 * Rendered inside a Canvas — Three.js gets us GLSL for free; we just
 * ship the material.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// fbm(uv, t) → warp two axes → mix three provider-tinted colors.
const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uResolution;

  // Standard 2D hash → noise → fbm.
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.03; a *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p  = uv * 2.5;
    float t = uTime * 0.06;

    // Domain warp so the field flows and swirls.
    vec2 q = vec2(fbm(p + t), fbm(p - t + 5.2));
    vec2 r = vec2(fbm(p + q * 1.8 + t * 1.1 + 1.7), fbm(p + q * 1.4 - t + 8.3));
    float f = fbm(p + r * 2.0);

    // Provider palette — violet (AI), blue (GCP/Azure blend), orange (AWS)
    vec3 violet = vec3(0.545, 0.361, 0.965);
    vec3 blue   = vec3(0.259, 0.522, 0.957);
    vec3 orange = vec3(1.000, 0.600, 0.000);
    vec3 col = mix(violet, blue, clamp(f * 1.4, 0.0, 1.0));
    col = mix(col, orange, clamp(pow(r.x, 3.0) * 0.85, 0.0, 1.0));

    // Radial vignette + top-heavy fade for readability.
    float d = length(uv - 0.5) * 1.35;
    col *= smoothstep(1.05, 0.15, d);

    // Fine noise to break up banding.
    col += (hash(uv * uResolution.xy + t) - 0.5) * 0.02;

    // Overall opacity kept modest — this sits behind content.
    gl_FragColor = vec4(col, 0.55);
  }
`;

// Exported so scenes can composite the nebula backdrop inside their own Canvas
// instead of stacking a second WebGL context — under swiftshader (headless
// screenshotting) and older drivers, Chrome caps live WebGL contexts and Act IV
// was losing both of its canvases, rendering white. One canvas, no cap hit.
// Vertex shader writes clip-space directly (ignores camera), so it composes
// cleanly regardless of the host camera; depthTest/depthWrite off keeps it
// behind the icons without z-fighting.
export function NebulaPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useFrame(({ clock, size }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    matRef.current.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    // renderOrder=-1 + depthTest off makes this draw first, behind everything.
    <mesh renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export function NebulaScene() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
    >
      <NebulaPlane />
    </Canvas>
  );
}
