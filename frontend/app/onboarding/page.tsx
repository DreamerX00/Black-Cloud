import type { Metadata } from "next";
import { OnboardingFlow } from "./onboarding-flow";

export const metadata: Metadata = {
  title: "Welcome to the universe",
  description: "A 60-second guided walk through BlackCloud.",
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
