"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, User, Building2 } from "lucide-react";
import { FormField } from "@/components/auth/form-field";
import { PillButton } from "@/components/ui/pill-button";

export function SignupForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    await new Promise(r => setTimeout(r, 900));
    toast.success("Welcome to BlackCloud · Preparing your onboarding");
    setBusy(false);
    router.push("/onboarding");
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          name="name"
          type="text"
          label="Your name"
          placeholder="Ada Lovelace"
          icon={<User className="h-4 w-4" />}
          autoComplete="name"
          required
        />
        <FormField
          name="org"
          type="text"
          label="Team / org"
          placeholder="Analytical Engines Ltd."
          icon={<Building2 className="h-4 w-4" />}
          autoComplete="organization"
        />
      </div>
      <FormField
        name="email"
        type="email"
        label="Work email"
        placeholder="you@company.com"
        icon={<Mail className="h-4 w-4" />}
        autoComplete="email"
        required
      />
      <FormField
        name="password"
        type="password"
        label="Password"
        placeholder="min 8 characters"
        icon={<Lock className="h-4 w-4" />}
        autoComplete="new-password"
        required
      />
      <PillButton type="submit" size="lg" className="w-full justify-center" disabled={busy}>
        {busy ? "Warming up your universe…" : "Create account"}
      </PillButton>
    </form>
  );
}
