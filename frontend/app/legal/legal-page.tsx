// Shared presentation for the two legal pages (privacy + terms). Pure server
// component: aurora ambience, sticky mini TOC, clay prose column. No client JS
// needed — TOC is native anchor links, offset handled via scroll-mt utility.
// ponytail: one shared layout for both legal routes, add a third arg if a page
// ever needs a different shell.
import Link from "next/link";
import { Navbar } from "@/components/nav/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuroraBackground } from "@/components/effects/aurora-background";
import { ClayPanel } from "@/components/layout/clay-panel";
import { SectionReveal } from "@/components/layout/section-reveal";

export type LegalSection = {
  id: string;
  title: string;
  body: string[];
};

export function LegalPage({
  kind,
  title,
  intro,
  sections,
}: {
  kind: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-background pt-24">
        <AuroraBackground className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70vh] opacity-40" />

        <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
          {/* Header */}
          <SectionReveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-cyan">
              {kind}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              <span className="text-gradient">{title}</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground">{intro}</p>
            {/* Static effective date — no dynamic Date() (SSR/hydration + blocked). */}
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: January 1, 2026
            </p>
          </SectionReveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
            {/* Sticky mini TOC */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <nav aria-label="On this page">
                <ClayPanel variant="inset" className="p-5">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    On this page
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm">
                    {sections.map((s, i) => (
                      <li key={s.id}>
                        <Link
                          href={`#${s.id}`}
                          className="flex gap-2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet"
                        >
                          <span className="tabular-nums text-accent-violet/80">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </ClayPanel>
              </nav>
            </aside>

            {/* Prose column */}
            <ClayPanel as="article" className="max-w-3xl px-6 py-10 sm:px-10">
              {sections.map((s, i) => (
                <SectionReveal
                  as="div"
                  key={s.id}
                  delay={i * 0.03}
                  className="scroll-mt-28 border-border/60 pb-8 pt-8 first:pt-0 [&:not(:last-child)]:border-b"
                >
                  <h2
                    id={s.id}
                    className="scroll-mt-28 font-display text-2xl font-semibold tracking-tight text-foreground"
                  >
                    <span className="mr-3 text-lg tabular-nums text-accent-violet/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
                    {s.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </SectionReveal>
              ))}

              <p className="mt-10 text-sm text-muted-foreground">
                Questions? Reach us at{" "}
                <a
                  href="mailto:legal@blackcloud.dev"
                  className="text-accent-cyan underline-offset-4 hover:underline"
                >
                  legal@blackcloud.dev
                </a>
                .
              </p>
            </ClayPanel>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
