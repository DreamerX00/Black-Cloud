"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { FormField } from "@/components/auth/form-field";
import { PillButton } from "@/components/ui/pill-button";

export function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    // ponytail: no backend yet — fake the trip, land on the dashboard.
    await new Promise(r => setTimeout(r, 700));
    toast.success("Signed in · Welcome back");
    setBusy(false);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormField
        name="email"
        type="email"
        label="Email"
        placeholder="you@company.com"
        icon={<Mail className="h-4 w-4" />}
        autoComplete="email"
        required
      />
      <FormField
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        icon={<Lock className="h-4 w-4" />}
        autoComplete="current-password"
        required
      />
      <div className="flex items-center justify-between text-sm">
        <label className="inline-flex items-center gap-2 text-ink-mute">
          <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/[0.03] accent-[var(--color-ai)]" />
          Remember me
        </label>
        <Link href="/forgot" className="text-ai hover:underline">Forgot password?</Link>
      </div>
      <PillButton type="submit" size="lg" className="w-full justify-center" disabled={busy}>
        {busy ? "Opening…" : "Enter the universe"}
      </PillButton>
    </form>
  );
}
