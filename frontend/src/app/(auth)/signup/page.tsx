import Link from "next/link";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SignupForm } from "@/features/auth/signup-form";
import { GoogleOAuthButton } from "@/features/auth/oauth-button";
import { FadeInUp } from "@/components/motion/primitives";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <FadeInUp className="w-full max-w-md">
      <Card className="border-border/60 bg-graphite/40 backdrop-blur">
        <CardHeader className="space-y-1.5">
          <CardTitle className="font-display text-2xl">Create your account</CardTitle>
          <CardDescription>
            Free during the beta. No credit card required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <GoogleOAuthButton />
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-graphite/40 px-2 text-xs uppercase tracking-widest text-muted-foreground">
              or
            </span>
          </div>
          <SignupForm />
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="ml-1 font-medium text-foreground hover:text-ai transition-colors"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </FadeInUp>
  );
}
