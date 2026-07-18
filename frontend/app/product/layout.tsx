import { type ReactNode } from "react";
import { Navbar } from "@/components/nav/navbar";
import { SiteFooter } from "@/components/layout/site-footer";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-24">{children}</main>
      <SiteFooter />
    </>
  );
}
