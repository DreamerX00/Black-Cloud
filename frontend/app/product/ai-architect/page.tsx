import { PageHero } from "@/components/layout/page-hero";
import { AIArchitectClient } from "./_client";

export const metadata = {
  title: "AI Architect | BlackCloud",
  description:
    "Generate complete cloud architectures from natural language. AI designs your infrastructure, estimates costs, and generates Terraform code.",
};

export default function AIArchitectProductPage() {
  return (
    <>
      <PageHero
        badge="AI Architect"
        title="Describe it. Build it."
        subtitle="Turn plain English into production-ready cloud architectures. Our AI generates infrastructure diagrams, cost estimates, security reviews, and Terraform — all from a single prompt."
      />
      <AIArchitectClient />
    </>
  );
}
