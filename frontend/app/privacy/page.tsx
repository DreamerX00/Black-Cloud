"use client";

import { motion } from "motion/react";
import { Shield, Lock, Eye, Server, Globe, UserCheck, Mail } from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { ClayPanel } from "@/components/layout/clay-panel";
import { SectionReveal, RevealItem } from "@/components/layout/section-reveal";
import { GlowOrb } from "@/components/effects/glow-orb";

const SECTIONS = [
  {
    icon: Eye,
    color: "#8B5CF6",
    title: "Information We Collect",
    content:
      "We collect information you provide directly — such as your name, email, and cloud architecture designs — as well as usage data like feature interactions, session duration, and error reports. We do not access or store your cloud provider credentials; all integrations use read-only, scoped OAuth tokens that you can revoke at any time.",
  },
  {
    icon: Server,
    color: "#06B6D4",
    title: "How We Use Your Data",
    content:
      "Your data powers your BlackCloud experience: saving projects, generating AI recommendations, computing cost estimates, and personalizing your dashboard. Aggregated, anonymized usage patterns help us improve the platform. We never sell personal data to third parties.",
  },
  {
    icon: Lock,
    color: "#22C55E",
    title: "Data Security",
    content:
      "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Infrastructure designs are stored in isolated, encrypted databases. We conduct regular security audits and maintain SOC 2 Type II compliance. Access to production systems is restricted to authorized personnel with multi-factor authentication.",
  },
  {
    icon: Shield,
    color: "#F59E0B",
    title: "Data Retention",
    content:
      "Active account data is retained as long as your account exists. Deleted projects are purged within 30 days. If you delete your account, all associated data is permanently removed within 90 days, except where retention is required by law.",
  },
  {
    icon: Globe,
    color: "#EF4444",
    title: "Third-Party Services",
    content:
      "We use select third-party services for authentication (Google, GitHub OAuth), analytics (privacy-focused, no cookie tracking), error monitoring, and AI model inference (OpenAI, Anthropic, Google). These services process only the minimum data necessary and are bound by data processing agreements.",
  },
  {
    icon: UserCheck,
    color: "#10B981",
    title: "Your Rights",
    content:
      "You can access, export, correct, or delete your data at any time from your account settings. For GDPR, CCPA, or other privacy regulation requests, contact privacy@blackcloud.dev. We respond to all requests within 30 days.",
  },
  {
    icon: Mail,
    color: "#A78BFA",
    title: "Contact",
    content:
      "For privacy questions or concerns, reach us at privacy@blackcloud.dev or through the contact form at blackcloud.dev/contact.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-void pt-20">
        {/* ambient glow */}
        <GlowOrb color="rgba(139,92,246,0.12)" size={500} className="absolute left-1/4 top-40" />
        <GlowOrb color="rgba(6,182,212,0.08)" size={400} className="absolute right-1/4 top-[60%]" />

        <PageHero
          title="Privacy Policy"
          subtitle="Your data, your control"
          badge="Legal"
        />

        <div className="relative mx-auto max-w-3xl px-6 py-16 space-y-6">
          <SectionReveal>
            <p className="text-sm text-muted-foreground">
              Last updated: July 1, 2026
            </p>
          </SectionReveal>

          <SectionReveal stagger={0.1}>
            {SECTIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <RevealItem key={s.title} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="mb-6"
                  >
                    <ClayPanel hoverable glowColor={s.color} className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5"
                          style={{ color: s.color }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="font-display text-lg font-semibold text-foreground">
                            {s.title}
                          </h2>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {s.content}
                          </p>
                        </div>
                      </div>
                    </ClayPanel>
                  </motion.div>
                </RevealItem>
              );
            })}
          </SectionReveal>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
