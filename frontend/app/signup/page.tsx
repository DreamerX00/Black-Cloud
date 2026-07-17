"use client";

// Full-screen bespoke signup — NOT AppFrame. Centered claymorphism card over a
// blooming-constellation R3F scene. zod-validated name/email/password with inline
// errors, gradient primary + Google outline, link to /login, trust row. Mock
// submit → sonner success.
import { useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Loader2, Lock, ShieldCheck } from "lucide-react";
import { SiGooglecloud } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Scene = dynamic(() => import("./scene"), { ssr: false });

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Field = "name" | "email" | "password";
type Errors = Partial<Record<Field, string>>;

const FIELDS: { name: Field; label: string; type: string; placeholder: string; autoComplete: string }[] = [
  { name: "name", label: "Full name", type: "text", placeholder: "Ada Lovelace", autoComplete: "name" },
  { name: "email", label: "Work email", type: "email", placeholder: "you@company.com", autoComplete: "email" },
  { name: "password", label: "Password", type: "password", placeholder: "8+ characters", autoComplete: "new-password" },
];

// Static gradient constellation for reduced-motion / no-webgl users.
function SceneFallback() {
  return (
    <div className="fixed inset-0 -z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.22),transparent_55%),radial-gradient(circle_at_75%_70%,rgba(34,211,238,0.18),transparent_55%)] bg-[#05060a]" />
  );
}

export default function SignupPage() {
  const reduced = useReducedMotion();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<Field, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as Field] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    // Mock submit — no backend. Resolve after a beat, then celebrate.
    window.setTimeout(() => {
      setSubmitting(false);
      toast.success("Account created", { description: `Welcome aboard, ${parsed.data.name.split(" ")[0]}.` });
    }, 900);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <SceneFallback />
      <Scene />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="clay relative z-10 w-full max-w-md rounded-3xl p-8 sm:p-10"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-accent-violet to-accent-cyan text-white shadow-lg">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">BlackCloud</span>
          </Link>
          <h1 className="font-display mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
            Create your <span className="text-gradient">account</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            One control plane for every cloud. Free to start.
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {FIELDS.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <label htmlFor={f.name} className="text-sm font-medium text-foreground">
                {f.label}
              </label>
              <Input
                id={f.name}
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                autoComplete={f.autoComplete}
                aria-invalid={!!errors[f.name]}
                aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
              />
              {errors[f.name] && (
                <p id={`${f.name}-error`} role="alert" className="text-xs text-status-danger">
                  {errors[f.name]}
                </p>
              )}
            </div>
          ))}

          <Button
            type="submit"
            disabled={submitting}
            className="mt-2 h-11 w-full rounded-xl bg-gradient-to-r from-accent-violet to-accent-cyan text-base font-semibold text-white shadow-lg hover:opacity-90"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Creating account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="size-4" aria-hidden />
              </>
            )}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => toast.info("Google sign-up is mocked in this demo")}
          className="h-11 w-full rounded-xl"
        >
          <SiGooglecloud className="size-4" aria-hidden />
          Continue with Google
        </Button>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-status-success" aria-hidden />
            SOC 2 Type II
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="size-3.5 text-accent-cyan" aria-hidden />
            Encrypted at rest
          </span>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent-violet hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
