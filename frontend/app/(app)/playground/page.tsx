import type { Metadata } from "next";
import { PlaygroundCanvas } from "@/components/playground/playground-canvas";

export const metadata: Metadata = { title: "Cloud Playground" };

export default function PlaygroundLanding() {
  return <PlaygroundCanvas projectId="playground · draft" />;
}
