"use client";
import { motion } from "motion/react";
import { CATALOG, PROVIDER_META } from "@/lib/catalog/nodes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Act2Galaxy() {
  return (
    <section className="relative min-h-[150vh] px-6 py-32">
      <h2 className="mb-16 text-center text-4xl font-bold">23 services. One surface.</h2>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATALOG.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }} transition={{ delay: (i % 3) * 0.08 }}>
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <p className="text-xs font-mono uppercase text-accent-violet">{PROVIDER_META[s.provider].label}</p>
                <CardTitle>{s.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-400">{s.blurb}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
