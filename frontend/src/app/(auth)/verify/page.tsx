import Link from "next/link";
import type { Metadata } from "next";
import { ClayPanel } from "@/components/ui/clay";
import { VerifyForm } from "@/features/auth/verify-form";
import { FadeInUp } from "@/components/motion/primitives";

export const metadata: Metadata = { title: "Verify your email" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <FadeInUp className="w-full max-w-md">
      <ClayPanel elevation={3} tone="default" className="p-8 space-y-8">
        <header className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            One last step
          </h1>
          <p className="text-sm text-ink-muted">
            Confirm your email so we can save the graphs you build.
          </p>
        </header>

        <VerifyForm email={email} />

        <footer className="text-center text-sm text-ink-muted">
          Wrong address?{" "}
          <Link
            href="/signup"
            data-magnetic
            className="font-medium text-ai-bright hover:text-ai transition-colors underline-offset-4 hover:underline"
          >
            Change it
          </Link>
        </footer>
      </ClayPanel>
    </FadeInUp>
  );
}
