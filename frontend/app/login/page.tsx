import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign back into BlackCloud.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title={<>Re-enter <br /><span className="text-gradient-nebula">the universe.</span></>}
      subtitle="Your council, your graph, your snapshots — right where you left them."
    >
      <div className="flex flex-col gap-6">
        <OAuthButtons />
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-white/8" />
          <span className="text-mono-caps text-ink-mute">or with email</span>
          <span className="h-px flex-1 bg-white/8" />
        </div>
        <LoginForm />
        <p className="text-center text-sm text-ink-mute">
          New here?{" "}
          <Link href="/signup" className="text-ai hover:underline">Create an account →</Link>
        </p>
      </div>
    </AuthShell>
  );
}
