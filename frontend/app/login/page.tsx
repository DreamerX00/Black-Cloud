"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { SiGoogle, SiGithub } from "react-icons/si";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClayPanel } from "@/components/layout/clay-panel";
import { Particles } from "@/components/effects/particles";
import { Aurora } from "@/components/effects/aurora";
import { GlowOrb } from "@/components/effects/glow-orb";
import { ScanLine } from "@/components/effects/scan-line";
import { GridBackground } from "@/components/effects/grid-background";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (_data: LoginForm) => {
    toast.info("Login coming soon");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col lg:flex-row overflow-hidden bg-void">
      {/* ── LEFT: Immersive background ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative flex items-center justify-center lg:w-[60%] w-full h-[35vh] lg:h-auto"
      >
        {/* Effects layer */}
        <GridBackground variant="dots" />
        <ScanLine speed={12} />
        <Particles particleCount={60} className="absolute inset-0" />
        <Aurora intensity="medium" className="absolute inset-0" />
        <GlowOrb
          color="rgba(139,92,246,0.25)"
          size={400}
          className="top-[10%] left-[15%]"
        />
        <GlowOrb
          color="rgba(59,130,246,0.2)"
          size={300}
          className="bottom-[15%] right-[10%]"
        />

        {/* Brand content */}
        <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
          <h1 className="font-display text-5xl lg:text-6xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent select-none">
            BlackCloud
          </h1>
          <p className="text-lg text-white/50 max-w-xs font-display">
            Welcome back to the universe
          </p>

          {/* Floating decorative icons */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {["☁", "⚡", "🔒", "⚙"].map((icon, i) => (
              <motion.span
                key={i}
                className="absolute text-white/10 text-2xl"
                style={{
                  top: `${20 + i * 18}%`,
                  left: `${10 + i * 22}%`,
                }}
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              >
                {icon}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT: Login form ── */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-1 items-center justify-center px-6 py-12 lg:w-[40%]"
      >
        <ClayPanel className="w-full max-w-md p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold text-white">
              Sign In
            </h2>
            <p className="text-sm text-white/40">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-white/70"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white/70"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                href="#"
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                size="lg"
                className="w-full clay-button"
                disabled={isSubmitting}
              >
                Sign In
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-white/30 shrink-0">or</span>
            <Separator className="flex-1" />
          </div>

          {/* OAuth */}
          <div className="flex flex-col gap-3">
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                className="w-full clay-card border border-white/10 gap-2 hover:border-white/20"
                onClick={() => toast.info("Login coming soon")}
              >
                <SiGoogle className="h-4 w-4" />
                Continue with Google
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                className="w-full clay-card border border-white/10 gap-2 hover:border-white/20"
                onClick={() => toast.info("Login coming soon")}
              >
                <SiGithub className="h-4 w-4" />
                Continue with GitHub
              </Button>
            </motion.div>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-white/40">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </ClayPanel>
      </motion.div>
    </div>
  );
}
