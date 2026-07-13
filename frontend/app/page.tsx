import { Hero } from "@/components/hero/hero";

// The homepage is an immersive WebGL constellation experience (Hero owns the
// scene, scroll choreography, and a reduced-motion / no-WebGL fallback).
export default function Home() {
  return <Hero />;
}
