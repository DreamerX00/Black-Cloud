import type { Metadata } from "next";
import Link from "next/link";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { Wand2, Boxes, Import, FileCode2, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "New project" };

const STARTERS = [
  {
    icon: Wand2,
    tint: "text-ai",
    title: "Describe it to the Council",
    body: "Type a sentence. The five agents draft, argue, and hand you a full architecture.",
    href: "/ai-architect?seed=new",
    tag: "Fastest",
  },
  {
    icon: Boxes,
    tint: "text-info",
    title: "Start from a blueprint",
    body: "40+ verified starters — Series A SaaS, HIPAA portal, event-driven analytics, more.",
    href: "/blueprints",
    tag: "Popular",
  },
  {
    icon: Import,
    tint: "text-aws",
    title: "Import Terraform · CloudFormation · Pulumi",
    body: "We parse read-only. Your remote state is safe.",
    href: "#",
    tag: "For existing infra",
  },
  {
    icon: FileCode2,
    tint: "text-success",
    title: "Blank canvas",
    body: "Just the grid, all the nodes, none of the assumptions.",
    href: "/playground/new",
    tag: "Purest",
  },
];

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-10">
      <div>
        <div className="text-mono-caps text-ai">New project</div>
        <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
          How do you want to begin?
        </h1>
        <p className="mt-3 max-w-2xl text-ink-dim">
          You can switch approaches at any time. Every path lands in the same graph model.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {STARTERS.map(s => {
          const Icon = s.icon;
          return (
            <Link key={s.title} href={s.href}>
              <ClayCard interactive className="group flex h-full flex-col gap-5 p-8">
                <div className="flex items-start justify-between">
                  <div className={`clay-sm inline-flex h-12 w-12 items-center justify-center rounded-2xl ${s.tint}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-ink-mute">
                    {s.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-dim">{s.body}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-ai opacity-0 transition-opacity group-hover:opacity-100">
                  Choose <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </ClayCard>
            </Link>
          );
        })}
      </div>

      <ClayCard variant="sm" className="flex flex-col justify-between gap-3 p-6 md:flex-row md:items-center">
        <div>
          <div className="font-display text-lg font-semibold">Not sure?</div>
          <p className="text-sm text-ink-dim">Ask the Council. They’ll pick the fastest path for what you described.</p>
        </div>
        <PillButton href="/ai-architect">Ask the Council</PillButton>
      </ClayCard>
    </div>
  );
}
