import { PageHero } from "@/components/layout/page-hero";
import { TimeMachineClient } from "./_client";

export const metadata = {
  title: "Time Machine | BlackCloud",
  description:
    "Version your infrastructure like code. Browse snapshots, compare architectures, and roll back to any point in time.",
};

export default function TimeMachineProductPage() {
  return (
    <>
      <PageHero
        badge="Time Machine"
        title="Version your infrastructure"
        subtitle="Every change is a snapshot. Browse your architecture's history, compare versions side-by-side, and understand why decisions were made — with full visual diffing."
      />
      <TimeMachineClient />
    </>
  );
}
