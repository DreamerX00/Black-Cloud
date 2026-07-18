"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, CheckCircle2 } from "lucide-react";
import { FormField } from "@/components/auth/form-field";
import { PillButton } from "@/components/ui/pill-button";

export function ForgotForm() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    await new Promise(r => setTimeout(r, 700));
    toast.success("If that email exists, a reset link is on its way.");
    setBusy(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="clay-inset flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-success" />
        <div className="font-display text-xl font-semibold">Check your inbox</div>
        <p className="text-sm text-ink-mute">If the address is on file, the reset link should arrive in under a minute.</p>
      </div>
    );
  }

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
      <PillButton type="submit" size="lg" className="w-full justify-center" disabled={busy}>
        {busy ? "Sending…" : "Send reset link"}
      </PillButton>
    </form>
  );
}
