import type { Metadata } from "next";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { FormField } from "@/components/auth/form-field";
import { Mail, User, Globe2, Sun, Moon, Zap } from "lucide-react";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <ClayCard variant="lg" className="p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="clay-sm grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-aws/40 to-ai/20 font-display text-xl font-semibold">AK</span>
            <div>
              <div className="font-display text-2xl font-semibold">Akash Singh</div>
              <div className="text-mono-caps text-ink-mute">Owner · Analytical Engines Ltd.</div>
            </div>
          </div>
          <PillButton variant="ghost">Change avatar</PillButton>
        </div>
      </ClayCard>

      <ClayCard variant="lg" className="p-8">
        <div className="mb-6">
          <div className="text-mono-caps text-ai">Identity</div>
          <div className="mt-2 font-display text-xl font-semibold">How the Council addresses you</div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Display name" icon={<User className="h-4 w-4" />} defaultValue="Akash Singh" />
          <FormField label="Email" icon={<Mail className="h-4 w-4" />} defaultValue="akash@analytical.engines" />
          <FormField label="Timezone" icon={<Globe2 className="h-4 w-4" />} defaultValue="Europe/London" />
          <FormField label="Handle" icon={<Zap className="h-4 w-4" />} defaultValue="akashsingh" />
        </div>
      </ClayCard>

      <ClayCard variant="lg" className="p-8">
        <div className="mb-6 text-mono-caps text-ai">Motion & appearance</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: Sun, label: "Ambient universe", hint: "Recommended · full 3D background" },
            { icon: Moon, label: "Reduced motion", hint: "Kills particles, keeps essential fades" },
            { icon: Zap, label: "Turbo mode", hint: "Compact panels, no easing delays" },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <ClayCard key={m.label} variant="sm" interactive className={`flex flex-col gap-3 p-5 ${i === 0 ? "ring-2 ring-ai" : ""}`}>
                <Icon className="h-4 w-4 text-ai" />
                <div className="font-display text-sm font-semibold">{m.label}</div>
                <div className="text-xs text-ink-mute">{m.hint}</div>
              </ClayCard>
            );
          })}
        </div>
      </ClayCard>

      <div className="flex justify-end gap-3">
        <PillButton variant="ghost">Discard</PillButton>
        <PillButton>Save changes</PillButton>
      </div>
    </div>
  );
}
