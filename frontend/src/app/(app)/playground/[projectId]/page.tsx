import type { Metadata } from "next";
import { PlaygroundShell } from "@/features/playground/playground-shell";

export const metadata: Metadata = { title: "Playground" };

/**
 * Playground route. Next.js 16 gives `params` as a Promise; we unwrap
 * once here so the client shell receives a plain string projectId.
 */
export default async function PlaygroundPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <PlaygroundShell projectId={projectId} />;
}
