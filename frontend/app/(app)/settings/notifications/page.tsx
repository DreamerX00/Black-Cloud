import type { Metadata } from "next";
import { ClayCard } from "@/components/ui/clay-card";

export const metadata: Metadata = { title: "Notifications" };

const CHANNELS = [
  { name: "Email", desc: "Digest of overnight Council notes at 08:00 local." },
  { name: "Slack", desc: "Real-time as Council posts. Muted after hours by default." },
  { name: "Web push", desc: "Only when tab is open · gentle." },
];

const TRIGGERS = [
  { name: "Council debate concluded", email: true, slack: true, web: false },
  { name: "Blast radius alert", email: true, slack: true, web: true },
  { name: "Health Score drop > 5", email: true, slack: true, web: false },
  { name: "Live Twin drift detected", email: true, slack: true, web: true },
  { name: "PR review requested", email: true, slack: false, web: false },
  { name: "New blueprint published", email: false, slack: true, web: false },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {CHANNELS.map(c => (
          <ClayCard key={c.name} className="p-6">
            <div className="font-display text-lg font-semibold">{c.name}</div>
            <p className="mt-1 text-sm text-ink-dim">{c.desc}</p>
          </ClayCard>
        ))}
      </div>

      <ClayCard className="overflow-hidden">
        <div className="border-b border-white/8 p-6">
          <div className="text-mono-caps text-ink-mute">Triggers</div>
        </div>
        <table className="w-full">
          <thead className="border-b border-white/8">
            <tr className="text-mono-caps text-ink-mute">
              <th className="p-4 text-left">Event</th>
              <th className="p-4 text-center">Email</th>
              <th className="p-4 text-center">Slack</th>
              <th className="p-4 text-center">Web</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {TRIGGERS.map(t => (
              <tr key={t.name} className="hover:bg-white/[0.02]">
                <td className="p-4 text-sm text-ink">{t.name}</td>
                {[t.email, t.slack, t.web].map((v, i) => (
                  <td key={i} className="p-4 text-center">
                    <span className={`inline-block h-4 w-4 rounded-full ${v ? "bg-success" : "border border-white/15"}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ClayCard>
    </div>
  );
}
