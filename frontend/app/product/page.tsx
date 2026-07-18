import { PageHero } from "@/components/layout/page-hero";
import { ProductOverviewClient } from "./_client";

export const metadata = {
  title: "Products | BlackCloud",
  description:
    "Explore BlackCloud's suite of cloud infrastructure tools — from visual design to AI-powered architecture, migration, chaos engineering, and version control.",
};

export default function ProductOverviewPage() {
  return (
    <>
      <PageHero
        badge="Product Suite"
        title="Build. Migrate. Test. Version."
        subtitle="Five powerful tools that transform how teams design, manage, and evolve cloud infrastructure. Every product works standalone or together as a unified platform."
      />
      <ProductOverviewClient />
    </>
  );
}
