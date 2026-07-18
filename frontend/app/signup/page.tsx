"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import { SiGoogle, SiGithub } from "react-icons/si";
import { Eye, EyeOff, Rocket } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ClayPanel } from "@/components/layout/clay-panel";
import { Aurora } from "@/components/effects/aurora";
import { GridBackground } from "@/components/effects/grid-background";
import { ScanLine } from "@/components/effects/scan-line";
import { GlowOrb } from "@/components/effects/glow-orb";
import { Particles } from "@/components/effects/particles";

/* ── schema ── */
const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
    terms: z.literal(true, { message: "You must accept the terms" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

/* ── password strength ── */
function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score += 25;
  if (/[A-Z]/.test(pw)) score += 25;
  if (/[0-9]/.test(pw)) score += 25;
  if (/[^A-Za-z0-9]/.test(pw)) score += 25;
  return score;
}

function strengthColor(s: number) {
  if (s <= 25) return "bg-red-500";
  if (s <= 50) return "bg-orange-500";
  if (s <= 75) return "bg-yellow-500";
  return "bg-green-500";
}

function strengthLabel(s: number) {
  if (s <= 25) return "Weak";
  if (s <= 50) return "Fair";
  if (s <= 75) return "Good";
  return "Strong";
}

/* ── page ── */
export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", terms: undefined as unknown as true },
  });

  const password = watch("password") ?? "";
  const strength = getStrength(password);

  function onSubmit(_data: SignupValues) {
    toast("Signup coming soon");
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-void">
      {/* background */}
      <Aurora intensity="low" className="z-0" />
      <GridBackground variant="dots" className="z-0" />
      <ScanLine speed={14} />
      <Particles particleCount={40} className="absolute inset-0 z-0" />
      <GlowOrb color="rgba(139,92,246,0.2)" size={350} className="top-[10%] left-[20%]" />
      <GlowOrb color="rgba(6,182,212,0.15)" size={280} className="bottom-[20%] right-[15%]" />

      {/* ── LEFT ── */}
      <div className="relative z-10 hidden w-1/2 items-center justify-center lg:flex">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-md px-12"
        >
          <Rocket className="mb-6 h-12 w-12 text-primary" />
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-white">
            Enter the cloud<br />
            <span className="bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
              universe
            </span>
          </h1>
          <p className="mt-4 text-lg text-white/50">
            Provision, monitor, and scale infrastructure across every cloud — from a single pane of glass.
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT ── */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full max-w-md"
        >
          <ClayPanel className="p-8">
            <h2 className="font-display text-2xl font-bold text-white">
              Create Account
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Start your journey with BlackCloud
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 space-y-4"
              noValidate
            >
              {/* name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/70">
                  Full name
                </label>
                <Input placeholder="Ada Lovelace" {...register("name")} />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* email */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/70">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* password */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/70">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                )}

                {/* ponytail: strength bar — Progress component with indicator color override via child selector */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div
                      className={cn(
                        "[&_[role=progressbar]>div]:!bg-red-500",
                        strength > 25 && "[&_[role=progressbar]>div]:!bg-orange-500",
                        strength > 50 && "[&_[role=progressbar]>div]:!bg-yellow-500",
                        strength > 75 && "[&_[role=progressbar]>div]:!bg-green-500",
                      )}
                    >
                      <Progress value={strength} className="h-1.5" />
                    </div>
                    <p className={cn("text-xs", strength <= 25 ? "text-red-400" : strength <= 50 ? "text-orange-400" : strength <= 75 ? "text-yellow-400" : "text-green-400")}>
                      {strengthLabel(strength)}
                    </p>
                  </div>
                )}
              </div>

              {/* confirm password */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/70">
                  Confirm password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* terms checkbox — native, no lib needed */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 h-4 w-4 rounded border-white/10 bg-graphite/50 accent-primary"
                  {...register("terms")}
                />
                <label htmlFor="terms" className="text-xs text-white/60 leading-snug">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="-mt-2 text-xs text-red-400">{errors.terms.message}</p>
              )}

              {/* submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating…" : "Create Account"}
              </Button>
            </form>

            {/* divider */}
            <div className="my-6 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-white/30">or</span>
              <Separator className="flex-1" />
            </div>

            {/* OAuth */}
            <div className="flex gap-3">
              <motion.div className="flex-1" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full clay-card border-white/10 hover:border-white/20"
                  onClick={() => toast("Google signup coming soon")}
                >
                  <SiGoogle className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full clay-card border-white/10 hover:border-white/20"
                  onClick={() => toast("GitHub signup coming soon")}
                >
                  <SiGithub className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </motion.div>
            </div>

            {/* sign-in link */}
            <p className="mt-6 text-center text-sm text-white/50">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </ClayPanel>
        </motion.div>
      </div>
    </div>
  );
}
