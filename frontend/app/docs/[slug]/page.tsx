import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getDoc, getDocSlugs, getAllDocs } from "@/content/docs";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export function generateStaticParams() {
  return getDocSlugs().map(slug => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const d = getDoc(slug);
  return d ? { title: `${d.title} — Docs`, description: d.body[0] } : { title: "Doc not found" };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const all = getAllDocs();
  const idx = all.findIndex(d => d.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <>
      <Section className="!pt-40">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-32 lg:h-fit">
            <Link href="/docs" className="mb-6 inline-flex items-center gap-2 text-sm text-ink-dim hover:text-ink">
              <ArrowLeft className="h-4 w-4" /> All docs
            </Link>
            <div className="clay-sm p-4">
              <div className="text-mono-caps text-ink-mute">{doc.section}</div>
              <ul className="mt-3 flex flex-col gap-1">
                {all.filter(d => d.section === doc.section).map(d => (
                  <li key={d.slug}>
                    <Link
                      href={`/docs/${d.slug}`}
                      className={
                        d.slug === slug
                          ? "block rounded-lg bg-ai/15 px-3 py-1.5 text-sm text-ai"
                          : "block rounded-lg px-3 py-1.5 text-sm text-ink-dim hover:bg-white/5 hover:text-ink"
                      }
                    >
                      {d.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <article>
            <Eyebrow>{doc.section}</Eyebrow>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight md:text-5xl">
              {doc.title}
            </h1>
            <div className="mt-8 space-y-6">
              {doc.body.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-ink-dim">{p}</p>
              ))}
            </div>

            <ClayCard variant="sm" className="mt-16 grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
              {prev ? (
                <Link href={`/docs/${prev.slug}`} className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/5">
                  <ArrowLeft className="h-4 w-4 text-ink-mute" />
                  <div>
                    <div className="text-mono-caps text-ink-mute">Previous</div>
                    <div className="text-sm text-ink">{prev.title}</div>
                  </div>
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/docs/${next.slug}`} className="flex items-center justify-end gap-3 rounded-xl p-3 hover:bg-white/5">
                  <div className="text-right">
                    <div className="text-mono-caps text-ink-mute">Next</div>
                    <div className="text-sm text-ink">{next.title}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ink-mute" />
                </Link>
              ) : <span />}
            </ClayCard>
          </article>
        </div>
      </Section>
    </>
  );
}
