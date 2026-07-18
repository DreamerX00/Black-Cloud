import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "We'll email a link to reset your BlackCloud password.",
};

export default function ForgotPage() {
  return (
    <AuthShell
      eyebrow="Reset password"
      title={<>Lost the <br /><span className="text-gradient-nebula">signal.</span></>}
      subtitle="No drama. We'll email a reset link to whatever address you signed up with."
    >
      <ForgotForm />
      <p className="mt-6 text-center text-sm text-ink-mute">
        Remembered it after all?{" "}
        <Link href="/login" className="text-ai hover:underline">Back to sign in →</Link>
      </p>
    </AuthShell>
  );
}
