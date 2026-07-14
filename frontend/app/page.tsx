"use client";
import dynamic from "next/dynamic";
import { ActsScroll } from "@/components/acts/acts-scroll";
import { Navbar } from "@/components/nav/navbar";
import { CursorGlow } from "@/components/effects/cursor-glow";

const ExperienceCanvas = dynamic(
  () => import("@/components/experience/experience-canvas").then((m) => m.ExperienceCanvas),
  { ssr: false },
);

export default function Home() {
  return (
    <>
      <ExperienceCanvas />
      <Navbar />
      <CursorGlow />
      <main className="relative">
        <ActsScroll />
      </main>
    </>
  );
}
