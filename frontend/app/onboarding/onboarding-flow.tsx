"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Cloud, Wand2, ShieldCheck, Rocket, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { MiniCanvas } from "@/components/product/mini-canvas";

const STEPS = [
  {
    icon: Cloud,
    eyebrow: "Step 01 · Pick a cloud (or three)",
    title: "Which cloud do you live in today?",
    body: "You can change this at any time. Multi-cloud is a first-class citizen — you don't have to commit.",
    choices: [
      { key: "aws", label: "AWS", tint: "text-aws" },
      { key: "azure", label: "Azure", tint: "text-azure" },
      { key: "gcp", label: "GCP", tint: "text-gcp" },
      { key: "all", label: "All three", tint: "text-ai" },
    ],
  },
  {
    icon: Wand2,
    eyebrow: "Step 02 · Meet the Council",
    title: "The five agents watching your graph",
    body: "Aria (AWS), Kaz (Azure), Elm (GCP), Terra (Terraform), Vex (Kubernetes). They will disagree. You will decide.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Step 03 · Set your comfort",
    title: "AI proposes. Humans approve. Always.",
    body: "Nothing touches real infrastructure without your explicit confirmation. Live Twin ships read-only first. You control everything.",
  },
  {
    icon: Rocket,
    eyebrow: "Step 04 · Enter",
    title: "Your first project is waiting",
    body: "Route53 → CloudFront → ALB → ECS → RDS — a starter architecture, live-validated, ready to remix.",
  },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState("all");
  const cur = STEPS[step];
  const Icon = cur.icon;

  const next = () => {
    if (step === STEPS.length - 1) {
      router.push("/dashboard");
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="section-shell mx-auto min-h-[100dvh] max-w-[1200px] !pt-32">
      {/* Progress rail */}
      <div className="mb-10 flex items-center gap-3">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1">
            <div
              className={`h-1 rounded-full transition-colors ${
                i <= step ? "bg-ai" : "bg-white/10"
              }`}
            />
          </div>
        ))}
        <div className="text-mono-caps text-ink-mute">
          {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="clay-sm inline-flex h-12 w-12 items-center justify-center rounded-2xl text-ai">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-6 text-mono-caps text-ai">{cur.eyebrow}</div>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
                {cur.title}
              </h1>
              <p className="mt-4 max-w-lg text-lg text-ink-dim">{cur.body}</p>

              {cur.choices && (
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {cur.choices.map(c => (
                    <button
                      key={c.key}
                      onClick={() => setChosen(c.key)}
                      className={`clay-sm relative rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 ${
                        chosen === c.key ? "outline outline-2 outline-ai" : ""
                      }`}
                    >
                      <div className={`text-mono-caps ${c.tint}`}>{c.label}</div>
                      {chosen === c.key && (
                        <Check className="absolute right-2 top-2 h-3.5 w-3.5 text-ai" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-12 flex items-center gap-3">
                <PillButton
                  variant="ghost"
                  size="md"
                  onClick={() => setStep(s => Math.max(0, s - 1))}
                  icon={<ChevronLeft className="h-4 w-4" />}
                  disabled={step === 0}
                >
                  Back
                </PillButton>
                <PillButton
                  size="lg"
                  onClick={next}
                  trailing={<ChevronRight className="h-4 w-4" />}
                >
                  {step === STEPS.length - 1 ? "Enter dashboard" : "Continue"}
                </PillButton>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <ClayCard variant="lg" className="relative overflow-hidden p-3">
          <MiniCanvas />
        </ClayCard>
      </div>
    </div>
  );
}
