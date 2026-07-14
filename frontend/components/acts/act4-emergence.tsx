"use client";
import { ShimmerButton } from "@/components/effects/shimmer-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TIERS = [
  { name: "Explorer", price: "$0", perks: ["1 cloud", "Community support", "5 deploys/day"] },
  { name: "Pilot", price: "$49", perks: ["3 clouds", "Priority support", "Unlimited deploys"] },
  { name: "Fleet", price: "Custom", perks: ["All clouds", "Dedicated SRE", "SLA 99.99%"] },
];

export default function Act4Emergence() {
  return (
    <section className="relative min-h-screen px-6 py-32 text-center">
      <h2 className="mb-16 text-4xl font-bold">Emerge with control.</h2>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
        {TIERS.map((t) => (
          <Card key={t.name} className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader><CardTitle>{t.name}</CardTitle><p className="text-3xl font-bold">{t.price}</p></CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-400">
              {t.perks.map((p) => <div key={p}>{p}</div>)}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-16"><ShimmerButton>Start free →</ShimmerButton></div>
      <footer className="mt-32 text-sm text-zinc-600">BlackCloud — descend, deploy, dominate.</footer>
    </section>
  );
}
