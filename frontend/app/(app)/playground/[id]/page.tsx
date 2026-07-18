import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaygroundCanvas } from "@/components/playground/playground-canvas";
import { getProject, getProjectIds } from "@/content/projects";

export function generateStaticParams() {
  return [{ id: "new" }, ...getProjectIds().map(id => ({ id }))];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (id === "new") return { title: "New canvas — Playground" };
  const p = getProject(id);
  return p ? { title: `${p.name} · Playground` } : { title: "Playground" };
}

export default async function PlaygroundProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== "new" && !getProject(id)) notFound();
  const label = id === "new" ? "new · draft" : (getProject(id)?.name ?? id);
  return <PlaygroundCanvas projectId={label} />;
}
