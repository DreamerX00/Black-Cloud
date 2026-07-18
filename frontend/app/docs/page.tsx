import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getDocSections } from "@/content/docs";
import { ArrowUpRight, BookOpen, Terminal, ShieldCheck, Wand2, Boxes, GitBranch } from "lucide-react";

export const metadata: Metadata = {
  title: "Docs — Learn how the graph works",
  description: "Getting started, playground shortcuts, AI Architect prompting, CLI, API, security & compliance.",
};

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Start here": BookOpen,
  Playground: Boxes,
  "AI Architect": Wand2,
  CLI: Terminal,
  API: GitBranch,
  Trust: ShieldCheck,
  Migration: GitBranch,
};

export default function DocsIndex() {
  const sections = getDocSections();

  return (
    <>
      <Section className="!pt-40">
        <Eyebrow>Docs</Eyebrow>
        <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.95] tracking-tight">
          Read the manual. <br />
          <span className="text-gradient-nebula">Then ignore it.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-dim">
          Everything you need to know is here — but you shouldn’t have to read most of it. Skim the section that matches what you’re doing right now.
        </p>
      </Section>

      <Section className="!pt-0">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(sections).map(([section, docs]) => {
            const Icon = sectionIcons[section] ?? BookOpen;
            return (
              <ClayCard key={section} interactive className="flex flex-col gap-4 p-7">
                <div className="flex items-center gap-3">
                  <div className="clay-sm inline-flex h-10 w-10 items-center justify-center rounded-xl text-ai">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="font-display text-xl font-semibold">{section}</h2>
                </div>
                <ul className="flex flex-col gap-2">
                  {docs.map(d => (
                    <li key={d.slug}>
                      <Link
                        href={`/docs/${d.slug}`}
                        className="group flex items-center justify-between rounded-xl px-3 py-2 text-sm text-ink-dim hover:bg-white/5 hover:text-ink"
                      >
                        {d.title}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </ClayCard>
            );
          })}
        </div>
      </Section>
    </>
  );
}
