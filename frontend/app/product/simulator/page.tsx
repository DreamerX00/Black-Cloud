import { PageHero } from "@/components/layout/page-hero";
import { SimulatorClient } from "./_client";

export const metadata = {
  title: "Failure Simulator | BlackCloud",
  description:
    "Test your infrastructure resilience with interactive failure simulations. Watch traffic reroute, measure recovery times, and harden your architecture.",
};

export default function SimulatorProductPage() {
  return (
    <>
      <PageHero
        badge="Failure Simulator"
        title="Break it before production does"
        subtitle="Simulate AZ outages, region failures, database crashes, and service cascades. Watch your architecture respond in real-time and measure your resilience score."
      />
      <SimulatorClient />
    </>
  );
}
