import type { Metadata } from "next";
import Link from "next/link";
import { FadeInUp, Stagger, StaggerItem } from "@/components/motion/primitives";
import {
  ClayPanel,
  ClayBadge,
  ClayDivider,
  ClayOrb,
  ClayCard,
  ClayCardBody,
} from "@/components/ui/clay";
import { Button } from "@/components/ui/button";
import {
  BookText,
  Sparkles,
  ArrowRight,
  Compass,
  ProviderMark,
  Zap,
  Rss,
} from "@/components/icons";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Deep dives, architecture postmortems, and the occasional strong opinion about IaC.",
};

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: "architecture" | "ai" | "product" | "postmortem" | "opinion";
  provider?: "aws" | "azure" | "gcp";
  author: string;
  date: string;
  readMinutes: number;
  featured?: boolean;
}

const CATEGORY_LABEL: Record<Post["category"], string> = {
  architecture: "Architecture",
  ai: "AI Copilot",
  product: "Product",
  postmortem: "Postmortem",
  opinion: "Opinion",
};

const POSTS: Post[] = [
  {
    slug: "graph-as-source-of-truth",
    title: "Why the graph is the source of truth — and Terraform isn&apos;t",
    excerpt:
      "Terraform tells you *what*. The graph tells you *why*. A field guide to designing systems that survive the org chart.",
    category: "opinion",
    author: "Akash Singh",
    date: "Jul 12, 2026",
    readMinutes: 9,
    featured: true,
  },
  {
    slug: "copilot-context-window",
    title: "How we fit an entire architecture into a single prompt",
    excerpt:
      "The graph is a compression problem, not a context problem. Here&apos;s how we serialize a 400-node stack into 1.8k tokens.",
    category: "ai",
    author: "Renji Tanaka",
    date: "Jul 04, 2026",
    readMinutes: 12,
  },
  {
    slug: "3am-nat-gateway",
    title: "The $47,000 NAT gateway: an incident retrospective",
    excerpt:
      "The origin story. What broke, why the graph would have caught it, and the changes we shipped as a result.",
    category: "postmortem",
    provider: "aws",
    author: "Akash Singh",
    date: "Jun 20, 2026",
    readMinutes: 15,
  },
  {
    slug: "azure-container-apps-deep-dive",
    title: "Azure Container Apps · when to reach for it, when to run",
    excerpt:
      "A pragmatic decision tree for Container Apps vs. AKS vs. App Service. With cost benchmarks from real workloads.",
    category: "architecture",
    provider: "azure",
    author: "Sofia Marchetti",
    date: "Jun 08, 2026",
    readMinutes: 11,
  },
  {
    slug: "gcp-anthos-notes",
    title: "GCP Anthos, one year in · notes from production",
    excerpt:
      "What Anthos got right, what still surprises us, and the exact config we use in prod.",
    category: "architecture",
    provider: "gcp",
    author: "Sofia Marchetti",
    date: "May 27, 2026",
    readMinutes: 8,
  },
  {
    slug: "shipping-v1",
    title: "Shipping v1: what we learned in the first six months",
    excerpt:
      "Metrics, mistakes, and the two decisions we&apos;d make differently.",
    category: "product",
    author: "Nia Okonkwo",
    date: "May 15, 2026",
    readMinutes: 7,
  },
];

const CATEGORY_TONES: Record<Post["category"], "ai" | "aws" | "azure" | "gcp" | "default"> = {
  architecture: "aws",
  ai: "ai",
  product: "default",
  postmortem: "default",
  opinion: "default",
};

export default function BlogIndex() {
  const featured = POSTS.find((p) => p.featured);
  const rest = POSTS.filter((p) => !p.featured);

  return (
    <main className="relative isolate min-h-screen pt-32 pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 nebula opacity-30" />
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-lines opacity-15" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 tablet:px-8 space-y-16">
        {/* Hero */}
        <FadeInUp className="space-y-6 text-center">
          <ClayBadge tone="ai" pulse className="mx-auto">
            <BookText className="size-3" /> The BlackCloud journal
          </ClayBadge>
          <h1 className="font-display text-5xl tablet:text-6xl font-semibold tracking-[-0.03em] leading-[0.95]">
            Deep dives &{" "}
            <span className="italic text-gradient-provider">strong opinions</span>.
          </h1>
          <p className="text-lg text-ink-muted leading-relaxed max-w-2xl mx-auto">
            Architecture postmortems, AI research notes, and the occasional rant
            about YAML. Weekly-ish. Rarely short.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button asChild variant="clay-ghost" size="sm">
              <Link href="/blog/rss.xml">
                <Rss className="size-3" /> RSS
              </Link>
            </Button>
            <Button asChild variant="clay-ghost" size="sm">
              <Link href="#subscribe">Subscribe</Link>
            </Button>
          </div>
        </FadeInUp>

        {/* Featured */}
        {featured && (
          <FadeInUp>
            <Link href={`/blog/${featured.slug}`} className="block group">
              <ClayPanel
                elevation={4}
                tone="raised"
                className="relative overflow-hidden isolate p-8 tablet:p-12 clay-hover"
              >
                <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 size-72 rounded-full bg-ai/20 blur-3xl" />
                <div className="relative z-10 grid gap-8 tablet:grid-cols-[1fr_auto] tablet:items-center">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <ClayBadge tone="ai" pulse>
                        <Sparkles className="size-3" /> Featured
                      </ClayBadge>
                      <ClayBadge tone="default" className="text-[9px]">
                        {CATEGORY_LABEL[featured.category]}
                      </ClayBadge>
                    </div>
                    <h2 className="font-display text-3xl tablet:text-4xl font-semibold tracking-tight leading-tight group-hover:text-gradient-provider transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-base text-ink-muted leading-relaxed">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-ink-dim">
                      <span>{featured.author}</span>
                      <span>·</span>
                      <span>{featured.date}</span>
                      <span>·</span>
                      <span>{featured.readMinutes} min read</span>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-sm text-ink font-medium">
                      <span>Read the essay</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                  <ClayOrb size="xl" tone="ai" className="mx-auto tablet:mx-0 animate-[float-y_5s_ease-in-out_infinite]">
                    <Compass className="size-12" />
                  </ClayOrb>
                </div>
              </ClayPanel>
            </Link>
          </FadeInUp>
        )}

        <ClayDivider />

        {/* Grid */}
        <Stagger className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
          {rest.map((post) => (
            <StaggerItem key={post.slug}>
              <PostCard post={post} />
            </StaggerItem>
          ))}
        </Stagger>

        <ClayDivider />

        {/* Subscribe */}
        <FadeInUp id="subscribe">
          <ClayPanel elevation={3} tone="raised" className="p-8 tablet:p-10 text-center space-y-4">
            <ClayBadge tone="ai" pulse className="mx-auto">
              <Zap className="size-3" /> Weekly-ish
            </ClayBadge>
            <h3 className="font-display text-3xl tablet:text-4xl font-semibold tracking-tight">
              One good architecture read, every week.
            </h3>
            <p className="text-sm text-ink-muted max-w-lg mx-auto">
              No promotions, no growth-hack subject lines. Just the best essay
              from us or from around the industry.
            </p>
            <form className="mx-auto mt-4 flex max-w-md flex-col gap-2 tablet:flex-row">
              <input
                type="email"
                placeholder="you@company.com"
                className="clay-pressed flex-1 rounded-clay-sm border border-white/5 bg-[--clay-bg-3] px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:outline-none focus:ring-1 focus:ring-ai/40"
              />
              <Button type="submit" variant="clay-primary">
                Subscribe <ArrowRight className="size-4" />
              </Button>
            </form>
          </ClayPanel>
        </FadeInUp>
      </div>
    </main>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group h-full">
      <ClayPanel elevation={2} tone="raised" className="h-full clay-hover">
        <ClayCardBody className="p-6 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <ClayBadge
              tone={CATEGORY_TONES[post.category]}
              className={cn("text-[9px]")}
            >
              {CATEGORY_LABEL[post.category]}
            </ClayBadge>
            {post.provider && (
              <ClayBadge tone={post.provider} className="text-[9px]">
                <ProviderMark provider={post.provider} className="size-2.5" />
                {post.provider}
              </ClayBadge>
            )}
          </div>
          <h3 className="font-display text-xl font-semibold tracking-tight leading-snug group-hover:text-ink transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-ink-muted leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2 pt-2 text-[10px] font-mono uppercase tracking-widest text-ink-dim">
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readMinutes} min</span>
          </div>
        </ClayCardBody>
      </ClayPanel>
    </Link>
  );
}
