import { PageHero } from "@/components/layout/page-hero";
import { MigrationClient } from "./_client";

export const metadata = {
  title: "Migration Ground | BlackCloud",
  description:
    "Visualize and plan cloud migrations across AWS, Azure, and GCP with intelligent service mapping and risk analysis.",
};

export default function MigrationProductPage() {
  return (
    <>
      <PageHero
        badge="Migration Ground"
        title="Migrate clouds visually"
        subtitle="Import your existing infrastructure from Terraform, CloudFormation, or Pulumi. Watch services morph across providers with intelligent mapping, risk scoring, and cost comparison."
      />
      <MigrationClient />
    </>
  );
}
