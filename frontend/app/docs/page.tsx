"use client";

// /docs — a cerebral docs shell laid over the bespoke "knowledge constellation"
// scene. Left clay sidebar of categories, a main column with a sample Getting
// Started article (prose, JetBrains-mono code block, callouts, next/prev), and a
// search input up top. Navbar + SiteFooter frame it. Client page (search state,
// motion, r3f) so no metadata export per the brief.
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import {
  Rocket,
  FlaskConical,
  BrainCircuit,
  ArrowLeftRight,
  Activity,
  History,
  Braces,
  Terminal,
  Search,
  Lightbulb,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Hash,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { SectionReveal } from "@/components/layout/section-reveal";
import { SiteFooter } from "@/components/layout/site-footer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DocsScene = dynamic(() => import("./scene"), { ssr: false });

type Category = { id: string; label: string; icon: LucideIcon; blurb: string };

const CATEGORIES: Category[] = [
  { id: "getting-started", label: "Getting Started", icon: Rocket, blurb: "Install, auth, first deploy" },
  { id: "playground", label: "Playground", icon: FlaskConical, blurb: "Try commands live" },
  { id: "ai-architect", label: "AI Architect", icon: BrainCircuit, blurb: "Describe infra in plain English" },
  { id: "migration", label: "Migration", icon: ArrowLeftRight, blurb: "Move between clouds" },
  { id: "simulator", label: "Simulator", icon: Activity, blurb: "Model cost & failure" },
  { id: "time-machine", label: "Time Machine", icon: History, blurb: "Snapshot & roll back" },
  { id: "api", label: "API", icon: Braces, blurb: "REST + webhooks reference" },
  { id: "cli", label: "CLI", icon: Terminal, blurb: "The blackcloud binary" },
];

const CODE_BLOCK = `# install the BlackCloud CLI
curl -fsSL https://get.blackcloud.dev | sh

# authenticate against the control plane
blackcloud login

# link your first provider and deploy
blackcloud provider add aws
blackcloud deploy ./app --provider aws --region us-east-1`;

const ON_PAGE = [
  { id: "install", label: "Install the CLI" },
  { id: "authenticate", label: "Authenticate" },
  { id: "first-deploy", label: "Your first deploy" },
  { id: "next-steps", label: "Next steps" },
];

function Callout({
  variant,
  title,
  children,
}: {
  variant: "note" | "warning";
  title: string;
  children: React.ReactNode;
}) {
  const isWarn = variant === "warning";
  const Icon = isWarn ? AlertTriangle : Lightbulb;
  return (
    <div
      className={cn(
        "clay-inset my-6 flex gap-3 rounded-2xl p-4 text-sm leading-relaxed",
        isWarn ? "border-l-2 border-status-warning/60" : "border-l-2 border-accent-cyan/60",
      )}
    >
      <Icon
        className={cn("mt-0.5 size-5 shrink-0", isWarn ? "text-status-warning" : "text-accent-cyan")}
        aria-hidden
      />
      <div>
        <p className={cn("font-semibold", isWarn ? "text-status-warning" : "text-accent-cyan")}>{title}</p>
        <p className="mt-1 text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}

export default function DocsPage() {
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [active] = useState("getting-started");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter(
      (c) => c.label.toLowerCase().includes(q) || c.blurb.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <>
      <Navbar />

      {/* Bespoke constellation scene sits behind everything as a calm backdrop. */}
      <DocsScene />
      <div className="pointer-events-none fixed inset-0 -z-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-20">
        {/* Header + search */}
        <SectionReveal as="div" className="mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-accent-cyan">Documentation</p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            The <span className="text-gradient">knowledge</span> constellation
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Everything you need to run every cloud from one control plane — guides, references, and the CLI.
          </p>
          <div className="relative mt-6 max-w-md">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the docs…"
              aria-label="Search documentation"
              className="pl-10"
            />
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)_200px]">
          {/* Left clay sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <nav aria-label="Documentation categories" className="clay rounded-3xl p-3">
              <ul className="space-y-1">
                {filtered.map((c) => {
                  const Icon = c.icon;
                  const isActive = c.id === active;
                  return (
                    <li key={c.id}>
                      <a
                        href={`#${c.id}`}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "group flex items-start gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/60",
                          isActive
                            ? "clay-inset text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Icon
                          className={cn(
                            "mt-0.5 size-4 shrink-0",
                            isActive ? "text-accent-cyan" : "text-muted-foreground group-hover:text-accent-cyan",
                          )}
                          aria-hidden
                        />
                        <span className="flex flex-col">
                          <span className="font-medium">{c.label}</span>
                          <span className="text-xs text-muted-foreground/70">{c.blurb}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
                {filtered.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-muted-foreground">No matches.</li>
                )}
              </ul>
            </nav>
          </aside>

          {/* Main article column */}
          <article className="clay min-w-0 rounded-3xl p-8 sm:p-10">
            <p className="text-xs font-medium uppercase tracking-widest text-accent-cyan">Getting Started</p>
            <h2 id="getting-started" className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
              Deploy your first cloud in five minutes
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              BlackCloud gives you a single control plane across AWS, Google Cloud, and Azure. This guide takes
              you from zero to a running deployment — no per-cloud tooling, no context switching. If you can run
              a shell command, you can ship to any cloud.
            </p>

            <h3 id="install" className="mt-10 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
              <Hash className="size-4 text-accent-cyan/60" aria-hidden /> Install the CLI
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              The CLI is a single static binary. Install it with the one-liner below, then link a provider and
              deploy — every command routes through the same control plane.
            </p>

            {/* JetBrains-mono code block on a clay-inset surface. */}
            <div className="clay-inset mt-5 overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                <span className="font-mono text-xs text-muted-foreground">bash</span>
                <span className="flex gap-1.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-status-danger/70" />
                  <span className="size-2.5 rounded-full bg-status-warning/70" />
                  <span className="size-2.5 rounded-full bg-status-success/70" />
                </span>
              </div>
              <pre className="overflow-x-auto px-4 py-4">
                <code className="font-mono text-sm leading-relaxed text-foreground/90">{CODE_BLOCK}</code>
              </pre>
            </div>

            <Callout variant="note" title="Tip">
              Already have an account? Run{" "}
              <code className="font-mono text-accent-cyan">blackcloud login --sso</code> to authenticate with
              your identity provider instead of a browser flow.
            </Callout>

            <h3 id="authenticate" className="mt-10 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
              <Hash className="size-4 text-accent-cyan/60" aria-hidden /> Authenticate
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              <code className="font-mono text-foreground/90">blackcloud login</code> opens a short-lived device
              flow and stores a scoped token in your OS keychain. Provider credentials never touch our servers —
              they stay in your environment and are used with least-privilege access.
            </p>

            <Callout variant="warning" title="Heads up">
              Scoped tokens expire after 12 hours by default. For CI, mint a machine token with{" "}
              <code className="font-mono">blackcloud token create --ci</code> and store it as a secret.
            </Callout>

            <h3 id="first-deploy" className="mt-10 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
              <Hash className="size-4 text-accent-cyan/60" aria-hidden /> Your first deploy
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Point the CLI at any app directory and pick a provider. BlackCloud detects the runtime, provisions
              the minimum viable footprint, and streams logs back to your terminal. Switch clouds later by
              changing a single flag — the control plane handles the rest.
            </p>

            <h3 id="next-steps" className="mt-10 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
              <Hash className="size-4 text-accent-cyan/60" aria-hidden /> Next steps
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              From here, explore the AI Architect to describe infrastructure in plain English, run cost and
              failure models in the Simulator, or snapshot and roll back with the Time Machine.
            </p>

            {/* Prev / next links */}
            <nav
              aria-label="Article pagination"
              className="mt-12 grid grid-cols-1 gap-4 border-t border-white/5 pt-8 sm:grid-cols-2"
            >
              <a
                href="#playground"
                className="clay-pressable group flex flex-col rounded-2xl p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/60"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowLeft className="size-3.5" aria-hidden /> Previous
                </span>
                <span className="mt-1 font-medium text-foreground group-hover:text-accent-cyan">Overview</span>
              </a>
              <a
                href="#playground"
                className="clay-pressable group flex flex-col items-end rounded-2xl p-4 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/60"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  Next <ArrowRight className="size-3.5" aria-hidden />
                </span>
                <span className="mt-1 font-medium text-foreground group-hover:text-accent-cyan">Playground</span>
              </a>
            </nav>
          </article>

          {/* On-this-page rail */}
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">On this page</p>
            <ul className="space-y-2 border-l border-white/10 text-sm">
              {ON_PAGE.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="-ml-px block border-l border-transparent pl-4 text-muted-foreground transition-colors hover:border-accent-cyan hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* Subtle animated pulse tying header to the scene (reduced-motion safe). */}
        {!reduced && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute right-10 top-24 -z-0 size-40 rounded-full bg-accent-cyan/20 blur-3xl"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </main>

      <SiteFooter />
    </>
  );
}
