import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "../legal-page";

export const metadata: Metadata = {
  title: "Terms of Service — BlackCloud",
  description:
    "The terms that govern your use of BlackCloud — accounts, acceptable use, intellectual property, liability, and termination.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of terms",
    body: [
      "By accessing or using BlackCloud, you agree to these Terms of Service and to our Privacy Policy. If you are using the service on behalf of an organization, you represent that you have authority to bind that organization to these terms.",
      "If you do not agree, do not use the service. We may update these terms from time to time; continued use after an update constitutes acceptance of the revised terms.",
    ],
  },
  {
    id: "accounts",
    title: "Accounts",
    body: [
      "You must provide accurate information when creating an account and keep it current. You are responsible for safeguarding your credentials and for all activity that occurs under your account.",
      "You must be at least 18 years old, or the age of majority in your jurisdiction, to use BlackCloud. Notify us immediately of any unauthorized access or suspected breach of your account.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: [
      "You agree not to misuse the service: no reverse engineering, no circumventing rate limits or security controls, no using BlackCloud to build a competing product, and no activity that violates applicable law or the rights of others.",
      "You are responsible for the cloud resources you connect and the actions you take through the control plane. Do not upload malware, attempt to disrupt the service, or access data you are not authorized to access.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: [
      "BlackCloud and its original content, features, and functionality are owned by BlackCloud, Inc. and protected by intellectual-property law. These terms grant you a limited, non-exclusive, non-transferable license to use the service.",
      "You retain all rights to your own data and configurations. By submitting feedback, you grant us a perpetual, royalty-free license to use it to improve the product, without obligation to compensate you.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: [
      "The service is provided “as is” and “as available,” without warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, error-free, or secure.",
      "To the maximum extent permitted by law, BlackCloud will not be liable for indirect, incidental, or consequential damages, and our total liability for any claim is limited to the amounts you paid us in the twelve months preceding the claim.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    body: [
      "You may stop using BlackCloud and delete your account at any time. We may suspend or terminate your access if you breach these terms, create risk or legal exposure for us, or fail to pay fees when due.",
      "On termination, your right to use the service ends immediately. We will make your exportable data available for a reasonable window before permanent deletion, except where retention is required by law.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: [
      "We may modify these terms to reflect changes in the service, the law, or our practices. When we make material changes, we will notify you by email or an in-product notice before they take effect.",
      "The “last updated” date at the top of this page indicates when the terms were last revised. If you continue to use BlackCloud after changes take effect, you accept the revised terms.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      kind="Legal"
      title="Terms of Service"
      intro="The agreement between you and BlackCloud. Read it once — it covers accounts, acceptable use, and the limits of our liability."
      sections={SECTIONS}
    />
  );
}
