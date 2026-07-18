"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Mail,
  Send,
  MapPin,
  Globe,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { SiDiscord, SiGithub, SiX } from "react-icons/si";

import { cn } from "@/lib/utils";
import { FAQ_ITEMS } from "@/lib/mock/index";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal, RevealItem } from "@/components/layout/section-reveal";
import { Particles } from "@/components/effects/particles";

// ── Schema ──────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

// ── Contact info cards ──────────────────────────────────────────────────────
const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@blackcloud.dev",
    href: "mailto:hello@blackcloud.dev",
    color: "text-violet-400",
    bg: "from-violet-500/20 to-violet-500/5",
  },
  {
    icon: SiDiscord,
    label: "Discord",
    value: "discord.gg/blackcloud",
    href: "https://discord.gg/blackcloud",
    color: "text-indigo-400",
    bg: "from-indigo-500/20 to-indigo-500/5",
  },
  {
    icon: SiGithub,
    label: "GitHub",
    value: "github.com/blackcloud",
    href: "https://github.com/blackcloud",
    color: "text-white",
    bg: "from-white/10 to-white/5",
  },
  {
    icon: SiX,
    label: "X / Twitter",
    value: "@blackclouddev",
    href: "https://x.com/blackclouddev",
    color: "text-sky-400",
    bg: "from-sky-500/20 to-sky-500/5",
  },
] as const;

const SUBJECT_OPTIONS = [
  "General inquiry",
  "Sales & pricing",
  "Technical support",
  "Partnership",
  "Bug report",
  "Feature request",
];

// ── Globe CSS art ───────────────────────────────────────────────────────────
function GlobeIllustration() {
  return (
    <div className="relative mx-auto my-12 flex h-64 w-64 items-center justify-center md:h-80 md:w-80">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 via-cyan-500/10 to-fuchsia-500/20 blur-2xl" />
      {/* Globe body */}
      <div className="relative h-full w-full rounded-full border border-white/10 bg-gradient-to-br from-deep-space via-graphite to-deep-space shadow-[var(--shadow-clay)]">
        {/* Latitude lines */}
        {[20, 40, 60, 80].map((top) => (
          <div
            key={top}
            className="absolute left-1/2 h-px -translate-x-1/2 rounded-full bg-violet-500/20"
            style={{
              top: `${top}%`,
              width: `${Math.sin((top / 100) * Math.PI) * 100}%`,
            }}
          />
        ))}
        {/* Longitude curves (simulated vertical arcs) */}
        {[-30, 0, 30].map((offset) => (
          <div
            key={offset}
            className="absolute top-[10%] h-[80%] rounded-full border border-violet-500/15"
            style={{
              left: `calc(50% + ${offset}%)`,
              width: "1px",
              transform: `rotateZ(${offset * 0.3}deg)`,
            }}
          />
        ))}
        {/* Glowing dots (cities) */}
        {[
          { top: "30%", left: "35%" },
          { top: "45%", left: "60%" },
          { top: "55%", left: "42%" },
          { top: "35%", left: "70%" },
          { top: "65%", left: "55%" },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-violet-400"
            style={pos}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-violet-400 blur-sm" />
          </motion.div>
        ))}
      </div>
      {/* MapPin overlay */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg border border-white/10 bg-graphite/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
        <MapPin className="h-3 w-3 text-violet-400" />
        Global Infrastructure
      </div>
    </div>
  );
}

// ── Main client component ───────────────────────────────────────────────────
export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = (_data: ContactForm) => {
    // ponytail: no backend yet, just toast
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you soon.");
    reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-void">
      {/* ── Background effects ────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Particles particleCount={50} className="absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-32 sm:px-6 lg:px-8">
        <PageHero
          title="Get in Touch"
          subtitle="Have a question, want to discuss your infrastructure needs, or just curious about BlackCloud? We'd love to hear from you."
          badge="Contact Us"
        />

        {/* ── Two-column layout ───────────────────────────────────────── */}
        <div className="mt-16 grid gap-10 lg:grid-cols-5">
          {/* LEFT: Contact form (3 cols) */}
          <SectionReveal variant="fade-left" className="lg:col-span-3">
            <div className="clay-panel rounded-2xl border border-white/5 p-6 md:p-10">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <CheckCircle2 className="mb-4 h-16 w-16 text-emerald-400" />
                  <h3 className="font-display text-2xl font-bold text-primary">
                    Message Sent!
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    We typically respond within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <h2 className="font-display text-2xl font-bold text-primary">
                    Send us a message
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form below and our team will get back to you
                    within one business day.
                  </p>

                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Name
                    </label>
                    <Input
                      placeholder="Your name"
                      className="clay-card border-white/5 bg-deep-space/60"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      className="clay-card border-white/5 bg-deep-space/60"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Subject select */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Subject
                    </label>
                    <select
                      className={cn(
                        "flex h-10 w-full rounded-xl border border-white/5 bg-deep-space/60 px-3 py-2 text-sm text-foreground",
                        "shadow-[var(--shadow-clay-inset)] transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary/50",
                        "clay-card appearance-none cursor-pointer"
                      )}
                      {...register("subject")}
                      defaultValue=""
                    >
                      <option value="" disabled className="bg-graphite text-muted-foreground">
                        Select a subject...
                      </option>
                      {SUBJECT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-graphite">
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="text-xs text-red-400">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Message
                    </label>
                    <Textarea
                      placeholder="Tell us about your project, question, or feedback..."
                      rows={6}
                      className="clay-card border-white/5 bg-deep-space/60"
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-400">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "clay-button w-full gap-2 rounded-xl bg-violet-600 py-3 font-display font-semibold text-white",
                      "shadow-[var(--shadow-clay)] transition-all hover:bg-violet-500 hover:shadow-lg",
                      "disabled:opacity-50"
                    )}
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </SectionReveal>

          {/* RIGHT: Contact info cards (2 cols) */}
          <SectionReveal
            variant="fade-right"
            className="lg:col-span-2"
            stagger={0.1}
          >
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-primary">
                Other ways to reach us
              </h2>
              <p className="text-sm text-muted-foreground">
                Prefer a different channel? We're active on all of these.
              </p>

              <div className="mt-6 space-y-4">
                {CONTACT_CHANNELS.map((ch) => (
                  <RevealItem key={ch.label}>
                    <a
                      href={ch.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clay-card group flex items-center gap-4 rounded-2xl border border-white/5 p-5 transition-all hover:border-violet-500/30 hover:shadow-lg"
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
                          ch.bg
                        )}
                      >
                        <ch.icon className={cn("h-5 w-5", ch.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-primary">
                          {ch.label}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {ch.value}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </RevealItem>
                ))}
              </div>

              {/* Office / response time card */}
              <RevealItem>
                <div className="clay-card mt-6 rounded-2xl border border-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-display text-sm font-semibold text-primary">
                      Response Time
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Our team is distributed globally. We typically respond to all
                    inquiries within <span className="text-violet-400 font-medium">24 hours</span> on
                    business days.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                    <span>
                      Enterprise customers: <span className="text-emerald-400 font-medium">4-hour SLA</span>
                    </span>
                  </div>
                </div>
              </RevealItem>
            </div>
          </SectionReveal>
        </div>

        {/* ── Globe illustration ───────────────────────────────────────── */}
        <SectionReveal variant="scale" className="mt-20">
          <div className="clay-panel rounded-2xl border border-white/5 p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-primary md:text-3xl">
              Powering Infrastructure{" "}
              <span className="text-gradient">Worldwide</span>
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
              BlackCloud serves teams across 40+ countries from data centers on
              every continent.
            </p>
            <GlobeIllustration />
          </div>
        </SectionReveal>

        {/* ── FAQ Section ──────────────────────────────────────────────── */}
        <SectionReveal variant="fade-up" className="mt-20 pb-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <span className="mb-3 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
                FAQ
              </span>
              <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-muted-foreground">
                Can't find what you're looking for? Reach out using the form
                above.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="clay-card rounded-xl border border-white/5 px-5"
                >
                  <AccordionTrigger className="py-4 text-left font-display text-sm font-medium text-primary hover:text-violet-300 [&[data-state=open]]:text-violet-400">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
