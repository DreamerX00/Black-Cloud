import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ProviderChip } from "@/components/ui/provider-chip";
import { getAllPosts } from "@/content/posts";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Field Notes — Writing about the graph, the tools, the fear",
  description: "Long-form writing from the BlackCloud engineering team.",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <Section className="!pt-40">
        <Eyebrow>Field Notes</Eyebrow>
        <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-tight">
          Writing from <span className="text-gradient-nebula">the graph.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-dim">
          Long-form pieces on infrastructure, teams that survive their own architecture, and what it actually takes to make a diagram tell the truth.
        </p>
      </Section>

      {featured && (
        <Section className="!pt-0">
          <Link href={`/blog/${featured.slug}`} className="block">
            <ClayCard variant="lg" interactive glow="ai" className="grid grid-cols-1 gap-8 p-10 lg:grid-cols-[1.2fr_1fr]">
              <div className="flex flex-col justify-between gap-6">
                <div>
                  <div className="text-mono-caps text-ai">Featured · {featured.date}</div>
                  <h2 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-base text-ink-dim">{featured.excerpt}</p>
                </div>
                <div className="flex items-center gap-4 text-mono-caps text-ink-mute">
                  <span>{featured.author}</span>
                  <span>· {featured.readingTime} min read</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-ai">Read <ArrowUpRight className="h-3.5 w-3.5" /></span>
                </div>
              </div>
              <div className="clay-inset relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 aurora opacity-60" aria-hidden />
                <div className="relative flex h-full min-h-[280px] items-center justify-center p-8 text-center">
                  <div className="font-display text-6xl text-ink">{featured.emoji}</div>
                </div>
              </div>
            </ClayCard>
          </Link>
        </Section>
      )}

      <Section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link href={`/blog/${p.slug}`} className="block h-full">
                <ClayCard interactive className="flex h-full flex-col gap-4 p-7">
                  <div className="text-mono-caps text-ink-mute">{p.date} · {p.readingTime} min</div>
                  <div className="font-display text-4xl">{p.emoji}</div>
                  <h3 className="font-display text-xl font-semibold leading-tight">{p.title}</h3>
                  <p className="text-sm text-ink-dim">{p.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="text-mono-caps text-ink-mute">{p.author}</span>
                    {p.tag && <ProviderChip provider={p.tag} />}
                  </div>
                </ClayCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
