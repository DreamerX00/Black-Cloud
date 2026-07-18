"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Sparkles, Zap, Building2, User, HelpCircle, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { PRICING_PLANS, FAQ_ITEMS } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ClayPanel } from "@/components/layout/clay-panel";
import { SectionReveal, RevealItem } from "@/components/layout/section-reveal";
import { NumberTicker } from "@/components/effects/number-ticker";
import { MagneticButton } from "@/components/effects/magnetic-button";

/* ------------------------------------------------------------------ */
/*  Plan icon mapping                                                  */
/* ------------------------------------------------------------------ */
const PLAN_ICONS: Record<string, React.ReactNode> = {
  Free: <User className="h-6 w-6" />,
  Pro: <Zap className="h-6 w-6" />,
  Team: <Sparkles className="h-6 w-6" />,
  Enterprise: <Building2 className="h-6 w-6" />,
};

/* ------------------------------------------------------------------ */
/*  Feature comparison data                                            */
/* ------------------------------------------------------------------ */
const COMPARISON_FEATURES = [
  { feature: "Projects", free: "3", pro: "Unlimited", team: "Unlimited", enterprise: "Unlimited" },
  { feature: "Nodes per project", free: "50", pro: "Unlimited", team: "Unlimited", enterprise: "Unlimited" },
  { feature: "Cloud providers", free: true, pro: true, team: true, enterprise: true },
  { feature: "Terraform export", free: true, pro: true, team: true, enterprise: true },
  { feature: "Pulumi & CloudFormation export", free: false, pro: true, team: true, enterprise: true },
  { feature: "AI architecture suggestions", free: false, pro: true, team: true, enterprise: true },
  { feature: "Migration maps", free: false, pro: true, team: true, enterprise: true },
  { feature: "Time-machine versioning", free: false, pro: "30 days", team: "1 year", enterprise: "Unlimited" },
  { feature: "Real-time collaboration", free: false, pro: false, team: true, enterprise: true },
  { feature: "Role-based access control", free: false, pro: false, team: true, enterprise: true },
  { feature: "CI/CD integration", free: false, pro: false, team: true, enterprise: true },
  { feature: "Slack & Teams notifications", free: false, pro: false, team: true, enterprise: true },
  { feature: "SSO / SAML", free: false, pro: false, team: false, enterprise: true },
  { feature: "SOC 2 & HIPAA compliance", free: false, pro: false, team: false, enterprise: true },
  { feature: "Custom policy enforcement", free: false, pro: false, team: false, enterprise: true },
  { feature: "Dedicated infrastructure", free: false, pro: false, team: false, enterprise: true },
  { feature: "On-premises deployment", free: false, pro: false, team: false, enterprise: true },
  { feature: "Support", free: "Community", pro: "Priority email", team: "Dedicated channel", enterprise: "24/7 phone & Slack" },
];

/* ------------------------------------------------------------------ */
/*  Pricing-specific FAQ subset                                        */
/* ------------------------------------------------------------------ */
const PRICING_FAQ = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes. Upgrade or downgrade whenever you want. When upgrading, you only pay the prorated difference for the remaining billing period. Downgrades take effect at the start of the next cycle.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer:
      "Absolutely. Pro and Team plans come with a 14-day free trial — no credit card required. You get full access to every feature during the trial period.",
  },
  {
    question: "How does per-seat pricing work on Team?",
    answer:
      "Each team member who needs edit access counts as a seat. View-only guests are free. You can add or remove seats at any time and billing adjusts automatically.",
  },
  ...FAQ_ITEMS.filter((f) =>
    ["Do you offer a free tier?", "Is my infrastructure data secure?"].includes(f.question)
  ),
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, Amex), ACH bank transfers for annual plans, and can issue invoices for Enterprise agreements. All payments are processed securely via Stripe.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "Your projects remain accessible in read-only mode for 30 days after cancellation. You can export everything during that period. After 30 days, data is permanently deleted per our retention policy.",
  },
];

/* ------------------------------------------------------------------ */
/*  Cell renderer for comparison table                                 */
/* ------------------------------------------------------------------ */
function CellValue({ value }: { value: boolean | string }) {
  if (value === true)
    return <Check className="mx-auto h-4 w-4 text-emerald-400" />;
  if (value === false)
    return <X className="mx-auto h-4 w-4 text-white/20" />;
  return (
    <span className="text-sm text-muted-foreground">{value}</span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main client component                                              */
/* ------------------------------------------------------------------ */
export function PricingClient() {
  const [annual, setAnnual] = useState(false);

  const getPrice = (plan: (typeof PRICING_PLANS)[number]) => {
    if (typeof plan.price === "string") return null; // Enterprise
    if (plan.price === 0) return 0;
    return annual ? Math.round(plan.price * 12 * 0.8 / 12) : plan.price;
  };

  return (
    <>
      {/* ============================================================ */}
      {/*  BILLING TOGGLE                                               */}
      {/* ============================================================ */}
      <SectionReveal className="mx-auto mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              !annual ? "text-white" : "text-muted-foreground"
            )}
          >
            Monthly
          </span>
          <Switch checked={annual} onCheckedChange={setAnnual} />
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              annual ? "text-white" : "text-muted-foreground"
            )}
          >
            Annual
          </span>
          {annual && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30"
            >
              Save 20%
            </motion.span>
          )}
        </div>
      </SectionReveal>

      {/* ============================================================ */}
      {/*  PLAN CARDS                                                    */}
      {/* ============================================================ */}
      <SectionReveal
        stagger={0.1}
        className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 xl:grid-cols-4"
      >
        {PRICING_PLANS.map((plan) => {
          const price = getPrice(plan);
          const isHighlighted = plan.highlighted;
          const isEnterprise = typeof plan.price === "string";

          return (
            <RevealItem key={plan.name}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300",
                  "clay-card bg-deep-space/60 backdrop-blur-sm",
                  isHighlighted
                    ? "border-violet-500/50 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
                    : "border-white/5 hover:border-white/10"
                )}
              >
                {/* popular badge */}
                {isHighlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-violet-500/90 text-white border-0 px-3 py-1 shadow-lg shadow-violet-500/25">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* glow ring for highlighted */}
                {isHighlighted && (
                  <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-violet-500/20 via-transparent to-violet-500/10 -z-10 blur-sm" />
                )}

                {/* plan header */}
                <div className="mb-6">
                  <div
                    className={cn(
                      "mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
                      isHighlighted
                        ? "bg-violet-500/20 text-violet-400"
                        : "bg-white/5 text-muted-foreground"
                    )}
                  >
                    {PLAN_ICONS[plan.name]}
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* price */}
                <div className="mb-6">
                  {isEnterprise ? (
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl font-bold text-white">
                        Custom
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl font-bold text-white">
                        $
                        <NumberTicker
                          value={price!}
                          duration={1200}
                          className="text-4xl font-bold"
                        />
                      </span>
                      {typeof plan.price === "number" && plan.price > 0 && (
                        <span className="text-sm text-muted-foreground">
                          /mo{plan.period.includes("seat") ? " per seat" : ""}
                        </span>
                      )}
                    </div>
                  )}
                  {annual && !isEnterprise && typeof plan.price === "number" && plan.price > 0 && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-1 text-xs text-emerald-400"
                    >
                      ${Math.round((plan.price as number) * 12 * 0.8)} billed
                      annually
                    </motion.p>
                  )}
                </div>

                {/* feature list */}
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <Check
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          isHighlighted
                            ? "text-violet-400"
                            : "text-emerald-400"
                        )}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <MagneticButton>
                  <Button
                    className={cn(
                      "w-full font-medium",
                      isHighlighted
                        ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                        : isEnterprise
                          ? "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                          : "bg-white/5 hover:bg-white/10 text-white"
                    )}
                    size="lg"
                    asChild
                  >
                    <Link
                      href={
                        isEnterprise ? "/contact" : "/signup"
                      }
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </MagneticButton>
              </div>
            </RevealItem>
          );
        })}
      </SectionReveal>

      {/* ============================================================ */}
      {/*  FEATURE COMPARISON TABLE                                      */}
      {/* ============================================================ */}
      <SectionReveal className="mx-auto mt-24 max-w-7xl px-6">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Compare plans in detail
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every feature across every tier — no surprises.
          </p>
        </div>

        <div className="clay-panel overflow-hidden rounded-2xl border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                    Feature
                  </th>
                  {["Free", "Pro", "Team", "Enterprise"].map((name) => (
                    <th
                      key={name}
                      className={cn(
                        "px-6 py-4 text-center text-sm font-semibold",
                        name === "Pro"
                          ? "text-violet-400"
                          : "text-white"
                      )}
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      "border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]",
                      i % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"
                    )}
                  >
                    <td className="px-6 py-3.5 text-sm font-medium text-white/80">
                      {row.feature}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <CellValue value={row.free} />
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <CellValue value={row.pro} />
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <CellValue value={row.team} />
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <CellValue value={row.enterprise} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionReveal>

      {/* ============================================================ */}
      {/*  FAQ SECTION                                                   */}
      {/* ============================================================ */}
      <SectionReveal className="mx-auto mt-24 max-w-3xl px-6">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-4">
            <HelpCircle className="mr-1.5 h-3 w-3" />
            FAQ
          </Badge>
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know about pricing and billing.
          </p>
        </div>

        <ClayPanel className="p-2">
          <Accordion type="single" collapsible className="w-full">
            {PRICING_FAQ.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-white/5"
              >
                <AccordionTrigger className="px-4 py-4 text-left text-sm font-medium text-white/90 hover:text-white hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ClayPanel>
      </SectionReveal>

      {/* ============================================================ */}
      {/*  CTA — STILL HAVE QUESTIONS?                                   */}
      {/* ============================================================ */}
      <SectionReveal className="mx-auto mt-24 max-w-3xl px-6 pb-24">
        <ClayPanel
          glowColor="#8b5cf6"
          className="relative overflow-hidden p-10 text-center"
        >
          {/* decorative gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/5" />

          <div className="relative z-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20">
              <MessageSquare className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white">
              Still have questions?
            </h3>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Our team is happy to help you find the right plan for your
              infrastructure needs.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <MagneticButton>
                <Button
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                  asChild
                >
                  <Link href="/contact">
                    Talk to Sales
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5"
                  asChild
                >
                  <Link href="/docs">
                    Read the docs
                  </Link>
                </Button>
              </MagneticButton>
            </div>
          </div>
        </ClayPanel>
      </SectionReveal>
    </>
  );
}
