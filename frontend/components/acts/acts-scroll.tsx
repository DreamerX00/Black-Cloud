"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/store/scroll-store";
import Act0Boot from "./act0-boot";
import Act1Approach from "./act1-approach";
import Act2Galaxy from "./act2-galaxy";
import Act3Core from "./act3-core";
import Act4Emergence from "./act4-emergence";

gsap.registerPlugin(ScrollTrigger);

export function ActsScroll() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      useScrollStore.getState().setTier("reduced");
      return;
    }

    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => useScrollStore.getState().setProgress(self.progress),
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={root} className="relative z-10">
      <Act0Boot />
      <Act1Approach />
      <Act2Galaxy />
      <Act3Core />
      <Act4Emergence />
    </div>
  );
}
