"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { BrutAlert } from "@/components/ui/clay";
import { cn } from "@/lib/utils";

/**
 * 6-digit code input — one <input> per digit, auto-advances on type,
 * accepts a paste of the full code, keyboard-navigable.
 */
export function VerifyForm({ email }: { email?: string }) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const code = digits.join("");
  const complete = code.length === 6;

  function update(index: number, value: string) {
    // Support pastes of the whole code
    if (value.length > 1) {
      const parsed = value.replace(/\D/g, "").slice(0, 6).split("");
      if (parsed.length === 0) return;
      const next = [...digits];
      parsed.forEach((d, i) => {
        if (index + i < 6) next[index + i] = d;
      });
      setDigits(next);
      const focusAt = Math.min(index + parsed.length, 5);
      inputRefs.current[focusAt]?.focus();
      return;
    }
    if (value && !/^\d$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    setError(null);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!complete) return;
    setSubmitting(true);
    // Backend endpoint TODO — simulate + navigate.
    await new Promise((r) => setTimeout(r, 900));
    if (code === "000000") {
      setError("Invalid code — try again");
      setSubmitting(false);
      return;
    }
    toast.success("Email verified");
    router.push("/dashboard");
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Verification code</label>
        <p className="text-xs text-ink-muted">
          {email ? `Sent to ${email}` : "Enter the code from your email."}
        </p>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            value={d}
            onChange={(e) => update(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            aria-label={`Digit ${i + 1}`}
            className={cn(
              "clay clay-pressed rounded-clay-sm h-14 text-center",
              "text-2xl font-mono text-ink bg-[--clay-bg-2]",
              "focus:outline-none focus:ring-2 focus:ring-ai",
              "transition-all",
              error && "ring-2 ring-danger",
            )}
          />
        ))}
      </div>

      {error && (
        <BrutAlert tone="danger">
          <div className="normal-case tracking-normal font-sans">{error}</div>
        </BrutAlert>
      )}

      <Button
        type="submit"
        variant="clay-primary"
        size="lg"
        disabled={!complete || submitting}
        className="w-full"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Verifying…
          </>
        ) : (
          <>
            Verify & continue
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>

      <button
        type="button"
        className="w-full text-center text-xs text-ink-dim hover:text-ink transition-colors font-mono uppercase tracking-widest"
        onClick={() => toast("Resent — check your inbox")}
      >
        Resend code
      </button>
    </form>
  );
}
