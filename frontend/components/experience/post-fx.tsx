"use client";

// Max-fidelity post-processing pipeline. Renders inside the existing Canvas.
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  ChromaticAberration,
  Vignette,
  Noise,
  SMAA,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function PostFX() {
  return (
    <EffectComposer>
      <Bloom mipmapBlur luminanceThreshold={0.6} intensity={1.2} radius={0.7} />
      <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={4} />
      <ChromaticAberration offset={[0.0006, 0.0006]} />
      <Vignette eskil={false} offset={0.35} darkness={0.85} />
      <Noise premultiply opacity={0.035} blendFunction={BlendFunction.NORMAL} />
      <SMAA />
    </EffectComposer>
  );
}
