"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, useReducedMotion } from "motion/react";
import { Building2, CheckCircle2, Headphones, Send, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/layout/section-reveal";
import { SiteFooter } from "@/components/layout/site-footer";
import { ShimmerButton } from "@/components/effects/shimmer-button";
import { Magnetic } from "@/components/effects/magnetic";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TECH_ICON } from "@/lib/brand-icons";
import { cn } from "@/lib/utils";

const ContactScene = dynamic(() => import("./scene"), { ssr: false });

const schema = z.object({
  name: z.string().min(2, "Please tell us your name."),
  email: z.string().email("Enter a valid email address."),
  company: z.string().min(2, "What team are you with?"),
  message: z.string().min(10, "A few more words, please (min 10 characters)."),
});
type FormValues = z.infer<typeof schema>;

const METHODS = [
  {
    icon: Building2,
    title: "Talk to sales",
    blurb: "Multi-cloud strategy, volume pricing, and a live product walkthrough.",
    contact: "sales@blackcloud.dev",
    accent: "text-accent-violet",
  },
  {
    icon: Headphones,
    title: "Get support",
    blurb: "Running into trouble mid-deploy? Our SREs answer fast, day or night.",
    contact: "support@blackcloud.dev",
    accent: "text-accent-cyan",
  },
  {
    icon: ShieldCheck,
    title: "Security & trust",
    blurb: "Report a vulnerability or request our SOC 2 report and DPA.",
    contact: "security@blackcloud.dev",
    accent: "text-status-success",
  },
] as const;

// Brand links from the shared TECH_ICON map (deterministic, no per-icon imports).
const SOCIALS = ["Vercel", "Docker", "Kubernetes", "Terraform", "Cloudflare"] as const;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function ContactForm() {
  const reduced = useReducedMotion();
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Mock submit — no network. Show a success toast + swap to the sent state.
  const onSubmit = handleSubmit(async (values) => {
    toast.success("Signal received", {
      description: `Thanks ${values.name.split(" ")[0]} — we'll beam a reply to ${values.email}.`,
    });
    reset();
    setSent(true);
  });

  if (sent) {
    return (
      <motion.div
        initial={reduced ? undefined : { opacity: 0, scale: 0.96 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="clay flex h-full flex-col items-center justify-center rounded-3xl p-10 text-center"
      >
        <div className="clay mb-5 grid size-16 place-items-center rounded-2xl text-status-success">
          <CheckCircle2 className="size-8" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground">Message on its way</h3>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Your signal reached the beacon. A human will reach out within one business day.
        </p>
        <Button
          variant="outline"
          className="mt-8 h-11 rounded-full px-6"
          onClick={() => setSent(false)}
        >
          Send another
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="clay rounded-3xl p-8">
      <h2 className="font-display text-2xl font-bold text-foreground">Send us a signal</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell us what you&apos;re building. We read every message.
      </p>
      <div className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Name" error={errors.name?.message}>
            <Input
              placeholder="Ada Lovelace"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="ada@team.dev"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </Field>
        </div>
        <Field label="Company" error={errors.company?.message}>
          <Input
            placeholder="Analytical Engines Inc."
            aria-invalid={!!errors.company}
            {...register("company")}
          />
        </Field>
        <Field label="Message" error={errors.message?.message}>
          <Textarea
            rows={5}
            placeholder="We're migrating three clouds and need zero-downtime cutovers…"
            aria-invalid={!!errors.message}
            {...register("message")}
          />
        </Field>
      </div>
      <div className="mt-7">
        <Magnetic>
          <ShimmerButton type="submit" disabled={isSubmitting} className="w-full">
            <Send className="mr-2 size-4" />
            {isSubmitting ? "Transmitting…" : "Transmit message"}
          </ShimmerButton>
        </Magnetic>
      </div>
    </form>
  );
}

function MethodCard({ method, index }: { method: (typeof METHODS)[number]; index: number }) {
  const reduced = useReducedMotion();
  const Icon = method.icon;
  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <SpotlightCard className="flex items-start gap-4 p-6">
        <div className={cn("clay grid size-12 shrink-0 place-items-center rounded-2xl", method.accent)}>
          <Icon className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">{method.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{method.blurb}</p>
          <a
            href={`mailto:${method.contact}`}
            className={cn("mt-2 inline-block text-sm font-medium underline-offset-4 hover:underline", method.accent)}
          >
            {method.contact}
          </a>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <PageHero
          scene={<ContactScene />}
          eyebrow="Contact"
          title={
            <>
              Send a signal to the <span className="text-gradient">beacon</span>.
            </>
          }
          subtitle="Questions, demos, or a security disclosure — reach the right team fast. Every message pulls straight to a human."
          actions={
            <>
              <Magnetic>
                <a href="#form">
                  <ShimmerButton>Start a conversation</ShimmerButton>
                </a>
              </Magnetic>
              <a
                href="#methods"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Other ways to reach us ↓
              </a>
            </>
          }
        />

        <span id="form" className="block" aria-hidden />
        <SectionReveal as="section" className="relative z-10 px-6 pt-12 pb-28">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left: contact form */}
            <ContactForm />

            {/* Right: methods + socials */}
            <div id="methods" className="flex flex-col gap-4">
              {METHODS.map((m, i) => (
                <MethodCard key={m.title} method={m} index={i} />
              ))}

              <div className="clay mt-2 rounded-3xl p-6">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Plays nicely with your stack
                </h3>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {SOCIALS.map((name) => {
                    const Icon = TECH_ICON[name];
                    return (
                      <a
                        key={name}
                        href="#"
                        aria-label={name}
                        className="clay-pressable grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Icon className="size-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </main>
      <SiteFooter />
    </>
  );
}
