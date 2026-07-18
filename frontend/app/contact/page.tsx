import { Navbar } from "@/components/nav/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import ContactClient from "./_client";

export const metadata = {
  title: "Contact | BlackCloud",
  description:
    "Get in touch with the BlackCloud team — questions, partnerships, support, or feedback.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactClient />
      <SiteFooter />
    </>
  );
}
