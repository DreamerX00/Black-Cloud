"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { Cloud, Loader2, ArrowRight, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginScene = dynamic(() => import("./scene"), { ssr: false });

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
type Values = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: "onTouched" });

  // ponytail: mock auth — no network. Fake latency, toast, redirect illusion.
  function onSubmit(values: Values) {
    setPending(true);
    window.setTimeout(() => {
      toast.success("Welcome back", { description: `Signed in as ${values.email}` });
      router.push("/dashboard");
    }, 900);
  }

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10">
      <LoginScene />

      <motion.section
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease }}
        className="clay glass relative z-10 w-full max-w-md rounded-3xl p-8 sm:p-10"
      >
        <Link href="/" className="mb-8 inline-flex items-center gap-2.5" aria-label="BlackCloud home">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-accent-violet to-accent-cyan text-white shadow-sm">
            <Cloud className="size-5" />
          </span>
          <span className="bg-gradient-to-r from-accent-violet to-accent-cyan bg-clip-text text-lg font-bold tracking-tight text-transparent">
            BLACKCLOUD
          </span>
        </Link>

        <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to your multi-cloud control plane.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-status-danger" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <button
                type="button"
                onClick={() => toast.info("Password reset link sent")}
                className="text-xs text-accent-cyan transition-colors hover:text-accent-violet focus-visible:underline focus-visible:outline-none"
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-status-danger" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="clay-pressable h-11 w-full bg-gradient-to-r from-accent-violet to-accent-cyan text-base font-semibold text-white hover:opacity-90"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Signing in…
              </>
            ) : (
              <>
                Sign in <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={pending}
          onClick={() => toast.info("Google sign-in is a demo — no real auth")}
          className="clay-pressable h-11 w-full text-sm font-medium"
        >
          <Globe className="size-4" /> Continue with Google
        </Button>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-accent-cyan hover:text-accent-violet">
            Create one
          </Link>
        </p>
      </motion.section>
    </main>
  );
}
