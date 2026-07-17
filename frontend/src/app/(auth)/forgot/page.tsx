import Link from "next/link";
import type { Metadata } from "next";
import { ClayPanel } from "@/components/ui/clay";
import { ForgotForm } from "@/features/auth/forgot-form";
import { FadeInUp } from "@/components/motion/primitives";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPage() {
  return (
    <FadeInUp className="w-full max-w-md">
      <ClayPanel elevation={3} tone="default" className="p-8 space-y-8">
        <header className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Reset your password
          </h1>
          <p className="text-sm text-ink-muted">
            Enter your email and we&apos;ll send a secure link to reset it.
          </p>
        </header>

        <ForgotForm />

        <footer className="text-center text-sm text-ink-muted">
          Remembered it?{" "}
          <Link
            href="/login"
            data-magnetic
            className="font-medium text-ai-bright hover:text-ai transition-colors underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </footer>
      </ClayPanel>
    </FadeInUp>
  );
}
