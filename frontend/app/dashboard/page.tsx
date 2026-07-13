"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Plus, Trash2, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import {
  projectStore,
  subscribeProjects,
  getProjectsSnapshot,
  getProjectsServerSnapshot,
  type Project,
} from "@/lib/projects/store";
import { PageMotion, FadeItem, TiltCard } from "@/components/shared/motion";
import GradientText from "@/components/reactbits/GradientText";
import Magnet from "@/components/reactbits/Magnet";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function DashboardPage() {
  // Read localStorage as an external store — no effect, no hydration mismatch,
  // and create/delete re-render automatically via the store's subscription.
  const projects = useSyncExternalStore(
    subscribeProjects,
    getProjectsSnapshot,
    getProjectsServerSnapshot,
  );
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const create = () => {
    const p = projectStore.create(name);
    setName("");
    setCreating(false);
    toast.success(`Created “${p.name}”`);
  };

  const remove = (p: Project) => {
    projectStore.remove(p.id);
    toast(`Deleted “${p.name}”`);
  };

  return (
    <ClickSpark sparkColor="#8b5cf6" sparkCount={8} sparkRadius={16}>
      <PageMotion className="mx-auto min-h-dvh w-full max-w-6xl px-6 py-10">
      <FadeItem>
        <header className="mb-8 flex items-center justify-between">
          <div>
            <GradientText
              colors={["#8b5cf6", "#4285f4", "#8b5cf6"]}
              animationSpeed={7}
              className="!mx-0 font-display text-3xl font-bold"
            >
              Projects
            </GradientText>
            <p className="text-sm text-fg-muted">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </p>
          </div>
          <Magnet padding={80} magnetStrength={4}>
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-fg shadow-[0_0_30px_-8px_var(--color-primary)] transition-transform hover:scale-[1.03]"
            >
              <Plus size={16} /> New project
            </button>
          </Magnet>
        </header>
      </FadeItem>

      {creating && (
        <div className="mb-6 flex gap-2 rounded-lg border border-border-strong bg-graphite p-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") create();
              if (e.key === "Escape") setCreating(false);
            }}
            placeholder="Project name"
            className="flex-1 rounded-md border border-border-strong bg-void px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus-visible:border-primary"
          />
          <button
            onClick={create}
            className="rounded-md bg-primary px-4 text-sm font-medium text-primary-fg"
          >
            Create
          </button>
          <button
            onClick={() => setCreating(false)}
            className="rounded-md border border-border-strong px-4 text-sm text-fg-muted hover:bg-slate"
          >
            Cancel
          </button>
        </div>
      )}

      {projects.length === 0 && !creating ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-strong py-20 text-center">
          <LayoutGrid className="text-fg-subtle" size={32} />
          <p className="text-fg-muted">No projects yet.</p>
          <button
            onClick={() => setCreating(true)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <TiltCard
              key={p.id}
              className="group relative overflow-hidden rounded-xl border border-border-strong bg-graphite transition-colors hover:border-primary"
            >
              {/* sheen sweep on hover */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Link href={`/project/${p.id}`} className="block p-5">
                <p className="truncate font-medium text-fg">{p.name}</p>
                <p className="mt-1 text-xs text-fg-subtle">
                  {p.graph.nodes.length} nodes · {p.graph.edges.length} connections
                </p>
                <p className="mt-3 text-xs text-fg-subtle">
                  Updated {new Date(p.updatedAt).toLocaleDateString()}
                </p>
              </Link>
              <button
                onClick={() => remove(p)}
                aria-label={`Delete ${p.name}`}
                className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-fg-subtle opacity-0 transition-opacity hover:bg-danger hover:text-white group-hover:opacity-100"
              >
                <Trash2 size={15} />
              </button>
            </TiltCard>
          ))}
        </ul>
      )}
      </PageMotion>
    </ClickSpark>
  );
}
