"use client";

// /about — origin-story scroll cinema. Client page (dynamic scene + motion), so
// no metadata export per the brief. Composes the shared PageHero + SectionReveal
// + ClayPanel surfaces over a bespoke server-galaxy R3F scene.
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Rocket, ShieldCheck, Sparkles, Users, Gauge, Globe } from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/layout/section-reveal";
import { ClayPanel } from "@/components/layout/clay-panel";
import { SiteFooter } from "@/components/layout/site-footer";
import { TextReveal } from "@/components/effects/text-reveal";
import { NumberTicker } from "@/components/effects/number-ticker";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { Magnetic } from "@/components/effects/magnetic";
import { ShimmerButton } from "@/components/effects/shimmer-button";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const AboutScene = dynamic(() => import("./scene"), { ssr: false });

const TIMELINE = [
  {
    year: "2019",
    title: "One console too many",
    body: "Four founders, three clouds, and a shared 3am incident. We were tab-hopping between consoles while an outage spread. The idea: one pane of glass for every provider.",
  },
  {
    year: "2021",
    title: "The first cutover",
    body: "We moved a customer's fleet from a single region to three providers with zero downtime — live, on a call. That demo became the product.",
  },
  {
    year: "2023",
    title: "The control plane",
    body: "BlackCloud became a real control plane: unified deploys, cost dashboards, and drift detection across AWS, GCP, and Azure from one graph.",
  },
  {
    year: "2026",
    title: "A galaxy of compute",
    body: "Thousands of teams orchestrate millions of resources through BlackCloud — every cloud, one horizon.",
  },
];

const VALUES = [
  {
    icon: Rocket,
    title: "Ship the impossible",
    body: "Zero-downtime cutovers, multi-cloud by default. If it feels like magic, we're doing it right.",
  },
  {
    icon: ShieldCheck,
    title: "Least privilege, always",
    body: "Scoped credentials, encrypted secrets, and audit trails baked in — not bolted on later.",
  },
  {
    icon: Sparkles,
    title: "Clarity over cleverness",
    body: "One graph, one truth. We surface the state of your whole fleet without the jargon.",
  },
  {
    icon: Users,
    title: "Customers in the room",
    body: "Every roadmap decision starts from a real incident, a real bill, a real migration.",
  },
  {
    icon: Gauge,
    title: "Fast, then correct",
    body: "We prototype at 60fps and harden relentlessly. Speed is a feature; reliability is the product.",
  },
  {
    icon: Globe,
    title: "Cloud-agnostic to the core",
    body: "No lock-in, no favorites. Your workloads run where they run best.",
  },
];

const STATS = [
  { value: 4, suffix: "", label: "Clouds supported" },
  { value: 8200000, suffix: "", label: "Deploys orchestrated" },
  { value: 99, suffix: ".99%", label: "Control-plane uptime" },
  { value: 190, suffix: "+", label: "Regions reachable" },
];

const TEAM = [
  { name: "Ada Okafor", role: "Co-founder, CEO" },
  { name: "Rohan Mehta", role: "Co-founder, CTO" },
  { name: "Lena Vasquez", role: "Head of Platform" },
  { name: "Marcus Bell", role: "Principal SRE" },
  { name: "Yuki Tanaka", role: "Design Lead" },
  { name: "Priya Nair", role: "Head of Security" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AboutPage() {
  const reduced = useReducedMotion();

  return (
    <>
      <Navbar />
      <main className="relative">
        <PageHero
          scene={<AboutScene />}
          eyebrow="Our story"
          title={
            <>
              One horizon for <span className="text-gradient">every cloud</span>.
            </>
          }
          subtitle="We started BlackCloud after one incident too many — tab-hopping between consoles while an outage spread. Today it's the control plane for a galaxy of compute."
          actions={
            <>
              <Magnetic>
                <ShimmerButton>Read the story ↓</ShimmerButton>
              </Magnetic>
              <Button asChild variant="outline" className="h-11 rounded-full px-6">
                <Link href="/contact">Talk to us →</Link>
              </Button>
            </>
          }
        />

        {/* Mission statement — huge display type */}
        <SectionReveal as="section" className="relative z-10 px-6 pt-16 pb-28">
          <div className="mx-auto max-w-4xl text-center">
            <span className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Our mission
            </span>
            <TextReveal>
              <h2 className="text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Make the whole cloud feel like{" "}
                <span className="text-gradient">one machine</span> — so teams can
                ship anywhere without ever learning three consoles.
              </h2>
            </TextReveal>
          </div>
        </SectionReveal>

        {/* Origin story timeline */}
        <SectionReveal as="section" className="relative z-10 px-6 pb-28">
          <div className="mx-auto max-w-3xl">
            <TextReveal>
              <h2 className="mb-12 text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How we got here
              </h2>
            </TextReveal>
            <ol className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-accent-violet/60 before:via-accent-cyan/40 before:to-transparent">
              {TIMELINE.map((item, i) => (
                <motion.li
                  key={item.year}
                  className="relative flex gap-6"
                  initial={reduced ? undefined : { opacity: 0, x: -24 }}
                  whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="clay flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-violet/30 to-accent-cyan/20 text-xs font-semibold text-foreground shadow-[0_0_24px_rgba(139,92,246,0.35)]">
                    {item.year.slice(2)}
                  </div>
                  <ClayPanel className="flex-1 p-6">
                    <span className="text-xs font-medium uppercase tracking-widest text-accent-violet">
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </ClayPanel>
                </motion.li>
              ))}
            </ol>
          </div>
        </SectionReveal>

        {/* Values grid — clay cards */}
        <SectionReveal as="section" className="relative z-10 px-6 pb-28">
          <div className="mx-auto max-w-5xl">
            <TextReveal>
              <h2 className="mb-12 text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                What we optimize for
              </h2>
            </TextReveal>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {VALUES.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={reduced ? undefined : { opacity: 0, y: 28 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.55, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SpotlightCard className="flex h-full flex-col p-7 text-left">
                    <div className="clay-inset mb-4 flex size-11 items-center justify-center rounded-2xl text-accent-cyan">
                      <value.icon className="size-5" aria-hidden />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Stats band — number tickers */}
        <SectionReveal as="section" className="relative z-10 px-6 pb-28">
          <div className="mx-auto max-w-5xl">
            <ClayPanel className="grid grid-cols-2 gap-8 rounded-3xl p-10 lg:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-4xl font-bold text-gradient sm:text-5xl">
                    <NumberTicker value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </ClayPanel>
          </div>
        </SectionReveal>

        {/* Team grid */}
        <SectionReveal as="section" className="relative z-10 px-6 pb-28">
          <div className="mx-auto max-w-5xl">
            <TextReveal>
              <h2 className="mb-3 text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                The people behind the horizon
              </h2>
            </TextReveal>
            <p className="mx-auto mb-12 max-w-md text-center text-muted-foreground">
              A small crew of platform engineers, designers, and SREs who have all
              been paged at 3am — and never want you to be.
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM.map((person, i) => (
                <motion.div
                  key={person.name}
                  initial={reduced ? undefined : { opacity: 0, y: 24 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ClayPanel className="flex items-center gap-4 p-6">
                    <Avatar className="size-12 text-sm">
                      <AvatarFallback>{initials(person.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{person.name}</h3>
                      <p className="text-sm text-muted-foreground">{person.role}</p>
                    </div>
                  </ClayPanel>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Closing CTA → /contact */}
        <SectionReveal as="section" className="relative z-10 px-6 pb-32 text-center">
          <div className={cn("mx-auto max-w-2xl")}>
            <TextReveal>
              <h2 className="text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Come build the horizon with us.
              </h2>
            </TextReveal>
            <p className="mx-auto mt-4 max-w-md text-balance text-muted-foreground">
              Whether you&apos;re migrating a fleet or just tired of three
              consoles — we&apos;d love to hear what you&apos;re building.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Magnetic>
                <Button asChild className="h-11 rounded-full px-8">
                  <Link href="/contact">Talk to us</Link>
                </Button>
              </Magnetic>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Get in touch →
              </Link>
            </div>
          </div>
        </SectionReveal>
      </main>
      <SiteFooter />
    </>
  );
}
