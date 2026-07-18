import type { Metadata } from "next";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { KeyRound, Copy, Plus } from "lucide-react";

export const metadata: Metadata = { title: "API keys" };

const KEYS = [
  { name: "CI · GitHub Actions", prefix: "bc_live_a92k…", created: "2026-06-12", last: "just now" },
  { name: "Local dev", prefix: "bc_test_1f0z…", created: "2026-04-03", last: "3d ago" },
  { name: "Terraform CLI", prefix: "bc_cli_82ac…", created: "2026-03-11", last: "1w ago" },
];

export default function APIKeysPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-mono-caps text-ai">API keys</div>
          <h2 className="font-display text-xl font-semibold">Scoped tokens for the CLI, CI, and integrations</h2>
        </div>
        <PillButton icon={<Plus className="h-4 w-4" />}>New key</PillButton>
      </div>

      <ClayCard className="overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/8">
            <tr className="text-mono-caps text-ink-mute">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Prefix</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-left">Last used</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {KEYS.map(k => (
              <tr key={k.name} className="hover:bg-white/[0.02]">
                <td className="p-4 text-sm text-ink flex items-center gap-3">
                  <KeyRound className="h-4 w-4 text-ai" /> {k.name}
                </td>
                <td className="p-4 font-mono text-sm text-ink-dim">{k.prefix}</td>
                <td className="p-4 text-sm text-ink-mute">{k.created}</td>
                <td className="p-4 text-sm text-ink-mute">{k.last}</td>
                <td className="p-4 text-right">
                  <button className="text-ink-mute hover:text-ink" aria-label="Copy prefix"><Copy className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ClayCard>
    </div>
  );
}
