"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Rocket,
  Code,
  Workflow,
  Brain,
  ArrowRightLeft,
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  FileText,
  Star,
  TrendingUp,
  Shield,
  Zap,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal, RevealItem } from "@/components/layout/section-reveal";
import { ClayPanel } from "@/components/layout/clay-panel";
import { Particles } from "@/components/effects/particles";
import { GlowOrb } from "@/components/effects/glow-orb";
import { GridBackground } from "@/components/effects/grid-background";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const DOC_CATEGORIES = [
  {
    icon: Rocket,
    title: "Getting Started",
    description:
      "Set up your BlackCloud account, connect your first provider, and deploy your inaugural workload in under ten minutes.",
    href: "/docs/getting-started",
    readTime: "5 min",
    articles: 12,
    color: "#8b5cf6",
  },
  {
    icon: Code,
    title: "API Reference",
    description:
      "Complete REST & GraphQL API documentation with authentication, rate limits, pagination, and real request/response examples.",
    href: "/docs/api",
    readTime: "15 min",
    articles: 48,
    color: "#3b82f6",
  },
  {
    icon: Workflow,
    title: "Cloud Playground",
    description:
      "Spin up sandboxed environments to experiment with multi-cloud topologies, auto-scaling rules, and cost simulations risk-free.",
    href: "/docs/playground",
    readTime: "8 min",
    articles: 9,
    color: "#06b6d4",
  },
  {
    icon: Brain,
    title: "AI Architect",
    description:
      "Leverage AI-powered infrastructure recommendations, anomaly detection, and automated right-sizing for peak efficiency.",
    href: "/docs/ai-architect",
    readTime: "10 min",
    articles: 15,
    color: "#f59e0b",
  },
  {
    icon: ArrowRightLeft,
    title: "Migration Guide",
    description:
      "Zero-downtime migration playbooks for moving workloads between AWS, Azure, GCP, and on-prem with rollback safety nets.",
    href: "/docs/migration",
    readTime: "12 min",
    articles: 21,
    color: "#10b981",
  },
  {
    icon: BookOpen,
    title: "Best Practices",
    description:
      "Battle-tested patterns for security hardening, cost governance, observability pipelines, and disaster recovery at scale.",
    href: "/docs/best-practices",
    readTime: "7 min",
    articles: 32,
    color: "#ec4899",
  },
] as const;

const POPULAR_ARTICLES = [
  {
    title: "Connecting your first AWS account",
    category: "Getting Started",
    readTime: "3 min",
    trending: true,
  },
  {
    title: "Authentication & API keys",
    category: "API Reference",
    readTime: "4 min",
    trending: false,
  },
  {
    title: "Setting up cost alerts and budgets",
    category: "Best Practices",
    readTime: "5 min",
    trending: true,
  },
  {
    title: "Multi-cloud networking with BlackCloud VPN mesh",
    category: "Cloud Playground",
    readTime: "8 min",
    trending: false,
  },
  {
    title: "AI-powered autoscaling configuration",
    category: "AI Architect",
    readTime: "6 min",
    trending: true,
  },
  {
    title: "Migrating RDS to Azure SQL with zero downtime",
    category: "Migration Guide",
    readTime: "10 min",
    trending: false,
  },
  {
    title: "Terraform state management via BlackCloud backend",
    category: "API Reference",
    readTime: "7 min",
    trending: false,
  },
  {
    title: "Implementing RBAC with SSO providers",
    category: "Best Practices",
    readTime: "5 min",
    trending: true,
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DocsContent() {
  const [search, setSearch] = useState("");

  const filtered = DOC_CATEGORIES.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredArticles = POPULAR_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative min-h-screen bg-void">
      {/* Background effects */}
      <Particles particleCount={40} className="fixed inset-0 pointer-events-none" />
      <GridBackground className="fixed inset-0 pointer-events-none opacity-30" />
      <GlowOrb color="rgba(139,92,246,0.12)" size={500} className="top-[5%] left-[10%]" />
      <GlowOrb color="rgba(59,130,246,0.1)" size={400} className="bottom-[20%] right-[5%]" />

      <div className="relative z-10">
        {/* ── Hero ── */}
        <section className="px-4 pt-12 pb-4 md:px-8">
          <PageHero
            title="Documentation"
            subtitle="Everything you need to build, migrate, and scale on BlackCloud. Search across guides, references, and tutorials."
            badge="Knowledge Base"
          >
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Search docs... (e.g. API keys, migration, autoscaling)"
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </PageHero>
        </section>

        {/* ── Category Cards ── */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
          <SectionReveal variant="fade-up">
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              Browse by Category
            </h2>
            <p className="text-white/40 mb-10 max-w-lg">
              Jump into the topic that matters most. Each section includes
              step-by-step guides, code samples, and video walkthroughs.
            </p>
          </SectionReveal>

          <SectionReveal variant="fade-up" stagger={0.08} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cat) => {
              const Icon = cat.icon;
              return (
                <RevealItem key={cat.title}>
                  <Link href={cat.href} className="group block h-full">
                    <ClayPanel
                      hoverable
                      glowColor={cat.color}
                      className="relative flex h-full flex-col gap-4 p-6 transition-colors"
                    >
                      {/* Icon */}
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ background: `${cat.color}15` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: cat.color }} />
                      </div>

                      {/* Title & description */}
                      <div className="flex-1">
                        <h3 className="font-display text-lg font-semibold text-white group-hover:text-primary transition-colors">
                          {cat.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/50">
                          {cat.description}
                        </p>
                      </div>

                      {/* Meta row */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-3">
                        <div className="flex items-center gap-3 text-xs text-white/30">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {cat.readTime} read
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {cat.articles} articles
                          </span>
                        </div>
                        <span className="text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1">
                          Read more <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </ClayPanel>
                  </Link>
                </RevealItem>
              );
            })}
          </SectionReveal>

          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/40 py-12"
            >
              No categories match &ldquo;{search}&rdquo;
            </motion.p>
          )}
        </section>

        {/* ── Quick Stats Bar ── */}
        <section className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionReveal variant="fade-up">
            <div className="clay-panel grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
              {[
                { label: "Total Articles", value: "137", icon: FileText },
                { label: "Code Examples", value: "500+", icon: Code },
                { label: "Video Tutorials", value: "42", icon: TrendingUp },
                { label: "Updated Weekly", value: "Every Fri", icon: Clock },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white font-display">{stat.value}</p>
                    <p className="text-xs text-white/40">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </section>

        {/* ── Popular Articles ── */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
          <SectionReveal variant="fade-up">
            <div className="flex items-center gap-3 mb-8">
              <Star className="h-5 w-5 text-amber-400" />
              <h2 className="font-display text-2xl font-bold text-white">
                Popular Articles
              </h2>
            </div>
          </SectionReveal>

          <SectionReveal variant="fade-up" stagger={0.05} className="grid gap-3 md:grid-cols-2">
            {filteredArticles.map((article) => (
              <RevealItem key={article.title}>
                <Link href="#" className="group block">
                  <div className="clay-card flex items-center gap-4 rounded-xl border border-white/5 p-4 transition-colors hover:border-primary/20 hover:bg-white/[0.02]">
                    <FileText className="h-5 w-5 shrink-0 text-white/30 group-hover:text-primary transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-white/30">{article.category}</span>
                        <span className="text-xs text-white/20">·</span>
                        <span className="text-xs text-white/30 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                    {article.trending && (
                      <Badge variant="outline" className="shrink-0 border-amber-500/30 text-amber-400 text-[10px]">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    <ArrowRight className="h-4 w-4 shrink-0 text-white/20 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              </RevealItem>
            ))}
          </SectionReveal>

          {filteredArticles.length === 0 && search && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/40 py-8"
            >
              No articles match &ldquo;{search}&rdquo;
            </motion.p>
          )}
        </section>

        {/* ── SDK & Tools Quick Links ── */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
          <SectionReveal variant="fade-up">
            <h2 className="font-display text-2xl font-bold text-white mb-8">
              SDKs &amp; Tools
            </h2>
          </SectionReveal>

          <SectionReveal variant="fade-up" stagger={0.06} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Node.js SDK", badge: "v3.2", color: "#10b981" },
              { name: "Python SDK", badge: "v2.8", color: "#3b82f6" },
              { name: "Terraform Provider", badge: "v1.5", color: "#8b5cf6" },
              { name: "CLI Tool", badge: "v4.0", color: "#f59e0b" },
            ].map((sdk) => (
              <RevealItem key={sdk.name}>
                <Link href="#" className="group block">
                  <ClayPanel hoverable className="flex items-center gap-3 p-4">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ background: sdk.color }}
                    />
                    <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                      {sdk.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="ml-auto text-[10px] border-white/10 text-white/40"
                    >
                      {sdk.badge}
                    </Badge>
                  </ClayPanel>
                </Link>
              </RevealItem>
            ))}
          </SectionReveal>
        </section>

        {/* ── CTA: Can't find what you're looking for? ── */}
        <section className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
          <SectionReveal variant="scale">
            <ClayPanel
              glowColor="#8b5cf6"
              className="relative overflow-hidden p-8 text-center md:p-12"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                  <MessageCircle className="h-7 w-7 text-violet-400" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                  Can&apos;t find what you&apos;re looking for?
                </h2>
                <p className="max-w-md text-white/50">
                  Our team is standing by to help. Reach out through our contact
                  page or jump into the community Discord.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                  <Button asChild size="lg">
                    <Link href="/contact">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Support
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild size="lg" className="border border-white/10">
                    <Link href="/docs">
                      <Shield className="mr-2 h-4 w-4" />
                      Join Community
                    </Link>
                  </Button>
                </div>
              </div>
            </ClayPanel>
          </SectionReveal>
        </section>
      </div>
    </div>
  );
}
