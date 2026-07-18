import { PageHero } from "@/components/layout/page-hero";
import { PlaygroundClient } from "./_client";

export const metadata = {
  title: "Cloud Playground | BlackCloud",
  description:
    "Visual drag-and-drop cloud architecture builder with real-time validation, cost estimation, and Infrastructure-as-Code export.",
};

export default function PlaygroundPage() {
  return (
    <>
      <PageHero
        badge="Cloud Playground"
        title="Design infrastructure visually"
        subtitle="Drag cloud services onto an infinite canvas, connect them with smart wires, validate in real-time, and export production-ready IaC. No YAML required."
      />
      <PlaygroundClient />
    </>
  );
}
