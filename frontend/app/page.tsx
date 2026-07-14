"use client";
import dynamic from "next/dynamic";
import { ActsScroll } from "@/components/acts/acts-scroll";

const ExperienceCanvas = dynamic(
  () => import("@/components/experience/experience-canvas").then((m) => m.ExperienceCanvas),
  { ssr: false },
);

export default function Home() {
  return (
    <main className="relative">
      <ExperienceCanvas />
      <ActsScroll />
    </main>
  );
}
