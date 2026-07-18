import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Ninety seconds from signup to your first animated architecture.",
};

export default function SignupPage() {
  return (
    <AuthShell
      side="left"
      eyebrow="Free forever · No card"
      title={<>Enter <br /><span className="text-gradient-aurora">the universe.</span></>}
      subtitle="Ninety seconds to your first animated architecture. Sixty more to your first Health Score."
    >
      <div className="flex flex-col gap-6">
        <OAuthButtons />
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-white/8" />
          <span className="text-mono-caps text-ink-mute">or with email</span>
          <span className="h-px flex-1 bg-white/8" />
        </div>
        <SignupForm />
        <p className="text-center text-sm text-ink-mute">
          Already have an account?{" "}
          <Link href="/login" className="text-ai hover:underline">Sign in →</Link>
        </p>
        <p className="text-center text-xs text-ink-faint">
          By continuing you accept our{" "}
          <Link href="/terms" className="underline">terms</Link>{" "}
          &{" "}
          <Link href="/privacy" className="underline">privacy policy</Link>.
        </p>
      </div>
    </AuthShell>
  );
}
