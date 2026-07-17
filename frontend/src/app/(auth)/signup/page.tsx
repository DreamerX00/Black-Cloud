import Link from "next/link";
import type { Metadata } from "next";
import { ClayPanel, ClayDivider, ClayBadge } from "@/components/ui/clay";
import { SignupForm } from "@/features/auth/signup-form";
import { GoogleOAuthButton } from "@/features/auth/oauth-button";
import { FadeInUp } from "@/components/motion/primitives";
import { Sparkles } from "@/components/icons";

export const metadata: Metadata = { title: "Create your account" };

export default function SignupPage() {
  return (
    <FadeInUp className="w-full max-w-md">
      <ClayPanel elevation={3} tone="default" className="p-8 space-y-8">
        <header className="space-y-3">
          <ClayBadge tone="ai" pulse>
            <Sparkles className="size-3" /> Free during beta
          </ClayBadge>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Design your first universe
          </h1>
          <p className="text-sm text-ink-muted">
            60 seconds to first architecture. No credit card.
          </p>
        </header>

        <div className="space-y-5">
          <GoogleOAuthButton />

          <div className="relative flex items-center gap-3">
            <ClayDivider />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-ink-dim">
              or with email
            </span>
            <ClayDivider />
          </div>

          <SignupForm />
        </div>

        <footer className="text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            data-magnetic
            className="font-medium text-ai-bright hover:text-ai transition-colors underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </footer>
      </ClayPanel>

      <p className="mt-6 text-center text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim">
        By creating an account you agree to the{" "}
        <Link href="/legal/terms" className="text-ink-muted hover:text-ink">
          terms
        </Link>{" "}
        &{" "}
        <Link href="/legal/privacy" className="text-ink-muted hover:text-ink">
          privacy
        </Link>
      </p>
    </FadeInUp>
  );
}
