"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Undo2, Redo2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { projectStore } from "@/lib/projects/store";
import { useCanvasStore } from "@/store/canvasStore";
import { PlaygroundCanvas } from "@/components/playground/canvas";
import { ExportMenu } from "@/components/playground/export-menu";
import Magnet from "@/components/reactbits/Magnet";
import StarBorder from "@/components/reactbits/StarBorder";

export default function ProjectPage({
  params,
}: {
  // Next.js 16: route params are a Promise, unwrapped with React.use().
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const load = useCanvasStore((s) => s.load);
  const snapshot = useCanvasStore((s) => s.snapshot);
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);

  // Read the project synchronously on first render (localStorage is client-only,
  // and this component is "use client"). Lazy initializer avoids a setState-in-effect
  // cascade; the graph loads into the store exactly once alongside it.
  const [name, setName] = useState<string>(() => {
    const project = projectStore.get(id);
    if (project) load(project.graph);
    return project?.name ?? "";
  });
  const ready = projectStore.get(id) !== undefined;

  // Only genuine side effect: redirect away if the project doesn't exist.
  useEffect(() => {
    if (!ready) {
      toast.error("Project not found");
      router.replace("/dashboard");
    }
  }, [ready, router]);

  const save = () => {
    projectStore.saveGraph(id, snapshot());
    toast.success("Saved");
  };

  const commitName = () => {
    if (name.trim()) projectStore.rename(id, name);
  };

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-fg-subtle">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <motion.header
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 border-b border-border bg-deep-space px-4 py-2.5"
      >
        <Link
          href="/dashboard"
          aria-label="Back to dashboard"
          className="rounded-md p-1.5 text-fg-muted transition-colors hover:bg-slate hover:text-fg"
        >
          <ArrowLeft size={18} />
        </Link>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          aria-label="Project name"
          className="min-w-0 flex-1 truncate rounded-md bg-transparent px-2 py-1 font-display text-lg font-semibold text-fg focus:bg-void focus:outline-none focus-visible:border focus-visible:border-primary"
        />
        <div className="flex items-center gap-1.5">
          <button onClick={undo} aria-label="Undo" className="rounded-md p-2 text-fg-muted hover:bg-slate hover:text-fg">
            <Undo2 size={16} />
          </button>
          <button onClick={redo} aria-label="Redo" className="rounded-md p-2 text-fg-muted hover:bg-slate hover:text-fg">
            <Redo2 size={16} />
          </button>
          <ExportMenu projectName={name} />
          <Magnet padding={60} magnetStrength={5}>
            <StarBorder
              as="button"
              onClick={save}
              color="#8b5cf6"
              speed="5s"
              className="ml-1"
            >
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <Save size={15} /> Save
              </span>
            </StarBorder>
          </Magnet>
        </div>
      </motion.header>

      <PlaygroundCanvas />
    </div>
  );
}
