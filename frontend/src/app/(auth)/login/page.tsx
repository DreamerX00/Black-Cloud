import Link from "next/link";
import type { Metadata } from "next";
import { ClayPanel, ClayDivider } from "@/components/ui/clay";
import { LoginForm } from "@/features/auth/login-form";
import { GoogleOAuthButton } from "@/features/auth/oauth-button";
import { FadeInUp } from "@/components/motion/primitives";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <FadeInUp className="w-full max-w-md">
      <ClayPanel elevation={3} tone="default" className="p-8 space-y-8">
        <header className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Welcome back
          </h1>
          <p className="text-sm text-ink-muted">
            Pick up where your architecture left off.
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

          <LoginForm />
        </div>

        <footer className="text-center text-sm text-ink-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            data-magnetic
            className="font-medium text-ai-bright hover:text-ai transition-colors underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </footer>
      </ClayPanel>

      <p className="mt-6 text-center text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim">
        Own the graph. Own the decision.
      </p>
    </FadeInUp>
  );
}
