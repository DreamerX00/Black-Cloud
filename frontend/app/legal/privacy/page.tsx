import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "../legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — BlackCloud",
  description:
    "How BlackCloud collects, uses, shares, and protects your data, and the rights you have over it.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "data-we-collect",
    title: "Data we collect",
    body: [
      "We collect information you provide directly — your name, work email, organization, and billing details when you create an account or subscribe to a plan. If you connect a cloud provider, we store the resource metadata and credentials scopes needed to render your infrastructure graph.",
      "We also collect technical data automatically: IP address, browser and device type, pages viewed, and interaction events. This telemetry helps us keep the control plane fast and reliable across every cloud you connect.",
    ],
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    body: [
      "We use your data to operate BlackCloud: authenticating sessions, syncing multi-cloud state, running cost and drift analysis, and delivering the features you enabled. We use aggregate, de-identified usage patterns to improve reliability and prioritize the roadmap.",
      "We send transactional messages (security alerts, billing receipts, deployment notifications) and, only with your consent, product updates. You can opt out of non-essential email at any time from your account settings.",
    ],
  },
  {
    id: "sharing",
    title: "Sharing",
    body: [
      "We do not sell your personal data. We share it only with sub-processors that power the service — cloud hosting, payment processing, error monitoring, and email delivery — each bound by contract to protect it and use it solely on our instructions.",
      "We may disclose information when required by law, to enforce our terms, or to protect the rights and safety of our users. If BlackCloud is involved in a merger or acquisition, we will notify you before your data becomes subject to a different privacy policy.",
    ],
  },
  {
    id: "security",
    title: "Security",
    body: [
      "Data is encrypted in transit with TLS 1.3 and at rest with AES-256. Provider credentials are stored in an isolated secrets vault with scoped, least-privilege access and are never exposed in logs or the UI.",
      "We enforce SSO and multi-factor authentication, run continuous vulnerability scanning, and undergo independent security reviews. No system is perfectly secure, but we design defensively and disclose material incidents promptly.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: [
      "Depending on where you live, you may have the right to access, correct, export, or delete your personal data, and to object to or restrict certain processing. You can exercise most of these directly from your account, or by contacting us.",
      "We honor verified requests within the timeframe your local law requires, and we will never discriminate against you for exercising a privacy right.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    body: [
      "If you have questions about this policy or how we handle your data, contact our privacy team. We aim to respond to every inquiry within five business days.",
      "For data-protection requests in the EU or UK, our appointed representative can be reached at the same address; mark your message “Attn: Data Protection Officer.”",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      kind="Legal"
      title="Privacy Policy"
      intro="Your infrastructure is sensitive. This policy explains, in plain language, what we collect and the control you keep over it."
      sections={SECTIONS}
    />
  );
}
