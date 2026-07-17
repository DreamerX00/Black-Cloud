import type { Metadata } from "next";
import { ApiKeysPanel } from "@/features/settings/api-keys-panel";

export const metadata: Metadata = { title: "API keys · Settings" };

export default function ApiKeysPage() {
  return <ApiKeysPanel />;
}
