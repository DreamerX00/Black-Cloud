"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/layout/section-reveal";
import { SiteFooter } from "@/components/layout/site-footer";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { Magnetic } from "@/components/effects/magnetic";
import { ShimmerButton } from "@/components/effects/shimmer-button";
import { Button } from "@/components/ui/button";
import { PRODUCT_NAV } from "@/lib/nav";

// Reuse the playground scene as the hub backdrop (already dynamic-safe, ssr:false).
const HubScene = dynamic(() => import("./playground/scene"), { ssr: false });

export default function ProductHubPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          scene={<HubScene />}
          eyebrow="The platform"
          title={
            <>
              One canvas for
              <br />
              every cloud.
            </>
          }
          subtitle="Five surfaces, one control plane — design, generate, migrate, break, and rewind your infrastructure across every provider."
          actions={
            <>
              <Magnetic>
                <Link href="/signup">
                  <ShimmerButton>Start building</ShimmerButton>
                </Link>
              </Magnetic>
              <Button asChild size="lg" variant="outline" className="h-11 px-6 text-base">
                <Link href="/pricing">See pricing</Link>
              </Button>
            </>
          }
        />

        <SectionReveal className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <SpotlightCard key={item.href} className="h-full">
                  <Link
                    href={item.href}
                    className="flex h-full flex-col gap-4 p-7"
                  >
                    <span className="clay-inset flex h-12 w-12 items-center justify-center rounded-xl">
                      <Icon className="h-6 w-6 text-[var(--accent-violet)]" aria-hidden />
                    </span>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-semibold">{item.label}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-violet)]">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </Link>
                </SpotlightCard>
              );
            })}
          </div>
        </SectionReveal>
      </main>
      <SiteFooter />
    </>
  );
}
