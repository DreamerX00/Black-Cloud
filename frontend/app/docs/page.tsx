import { Navbar } from "@/components/nav/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import DocsContent from "./docs-content";

export const metadata = {
  title: "Documentation | BlackCloud",
  description:
    "Guides, API references, and tutorials for the BlackCloud multi-cloud platform.",
};

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main>
        <DocsContent />
      </main>
      <SiteFooter />
    </>
  );
}
