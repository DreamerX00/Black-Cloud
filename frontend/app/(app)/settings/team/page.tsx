import type { Metadata } from "next";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { UserPlus, MoreHorizontal } from "lucide-react";

export const metadata: Metadata = { title: "Team & seats" };

const TEAM = [
  { name: "Akash Singh", email: "akash@analytical.engines", role: "Owner", tint: "text-ai" },
  { name: "Priyanka R.",  email: "priyanka@analytical.engines", role: "Admin", tint: "text-aws" },
  { name: "Marcus O.",    email: "marcus@analytical.engines", role: "Editor", tint: "text-info" },
  { name: "Lena F.",       email: "lena@analytical.engines", role: "Editor", tint: "text-info" },
  { name: "Ade K.",        email: "ade@analytical.engines", role: "Editor", tint: "text-info" },
  { name: "Rin T.",        email: "rin@analytical.engines", role: "Viewer", tint: "text-ink-mute" },
];

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <ClayCard variant="lg" className="grid grid-cols-1 gap-6 p-8 md:grid-cols-4">
        {[
          { l: "Seats", v: "12", h: "6 used · 6 free" },
          { l: "Owners", v: "1", h: "you" },
          { l: "Admins", v: "1", h: "billing + org" },
          { l: "Viewers", v: "∞", h: "always free" },
        ].map(k => (
          <div key={k.l}>
            <div className="font-display text-4xl font-semibold">{k.v}</div>
            <div className="text-mono-caps text-ink-mute">{k.l}</div>
            <div className="mt-1 text-xs text-ink-mute/70">{k.h}</div>
          </div>
        ))}
      </ClayCard>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-mono-caps text-ai">Members</div>
          <div className="font-display text-xl font-semibold">Who has access</div>
        </div>
        <PillButton icon={<UserPlus className="h-4 w-4" />}>Invite member</PillButton>
      </div>

      <ClayCard className="overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/8">
            <tr className="text-mono-caps text-ink-mute">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {TEAM.map(m => (
              <tr key={m.email} className="hover:bg-white/[0.02]">
                <td className="p-4 flex items-center gap-3">
                  <span className="clay-sm grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-ai/30 to-aws/20 font-display text-xs font-semibold">
                    {m.name.split(" ").map(x => x[0]).join("")}
                  </span>
                  {m.name}
                </td>
                <td className="p-4 text-sm text-ink-dim">{m.email}</td>
                <td className={`p-4 text-mono-caps ${m.tint}`}>{m.role}</td>
                <td className="p-4 text-right">
                  <button className="text-ink-mute hover:text-ink"><MoreHorizontal className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ClayCard>
    </div>
  );
}
