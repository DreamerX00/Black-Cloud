import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, getPostSlugs, getAllPosts } from "@/content/posts";
import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ProviderChip } from "@/components/ui/provider-chip";
import { PillButton } from "@/components/ui/pill-button";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export function generateStaticParams() {
  return getPostSlugs().map(slug => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getAllPosts().filter(p => p.slug !== slug).slice(0, 3);

  return (
    <>
      <Section className="!pt-40">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-ink-dim hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to Field Notes
        </Link>
        <Eyebrow>{post.date} · {post.readingTime} min read</Eyebrow>
        <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[1.02] tracking-tight">
          {post.title}
        </h1>
        <div className="mt-6 flex items-center gap-4">
          <span className="text-mono-caps text-ink-mute">{post.author}</span>
          {post.tag && <ProviderChip provider={post.tag} />}
        </div>
      </Section>

      <Section className="!pt-0">
        <ClayCard variant="lg" className="relative overflow-hidden p-2">
          <div className="clay-inset relative flex aspect-[21/9] w-full items-center justify-center overflow-hidden rounded-[24px]">
            <div className="absolute inset-0 aurora opacity-60" aria-hidden />
            <div className="relative font-display text-9xl">{post.emoji}</div>
          </div>
        </ClayCard>
      </Section>

      <article className="mx-auto max-w-3xl px-6 pb-20">
        <div className="prose prose-invert max-w-none">
          {post.body.map((p, i) => (
            <p key={i} className="mb-6 text-lg leading-relaxed text-ink-dim first-letter:font-display first-letter:text-4xl first-letter:font-semibold first-letter:text-ink">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-16 clay-lg flex flex-col gap-4 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-mono-caps text-ai">Ready to try it?</div>
            <div className="mt-1 font-display text-xl font-semibold">Enter the BlackCloud universe.</div>
          </div>
          <PillButton href="/signup">Start free</PillButton>
        </div>
      </article>

      <Section eyebrow="More Field Notes">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {related.map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`}>
              <ClayCard interactive className="flex h-full flex-col gap-3 p-6">
                <div className="text-mono-caps text-ink-mute">{p.date}</div>
                <div className="font-display text-2xl">{p.emoji}</div>
                <h3 className="font-display text-lg font-semibold leading-tight">{p.title}</h3>
                <p className="text-sm text-ink-dim">{p.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-ai">Read <ArrowUpRight className="h-3.5 w-3.5" /></span>
              </ClayCard>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
