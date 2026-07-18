import { Sparkles, ShieldCheck, Layers, Cpu, Rocket, Radar, Globe2, Zap } from "lucide-react";

const items = [
  { icon: Sparkles, text: "AI Architect · design in a sentence" },
  { icon: ShieldCheck, text: "Blast Radius Preview · see before you break" },
  { icon: Layers, text: "One graph · seven lenses" },
  { icon: Cpu, text: "Live Twin · your infra, mirrored" },
  { icon: Rocket, text: "Migration Ground · morph across clouds" },
  { icon: Radar, text: "Failure Simulator · rehearse the worst hour" },
  { icon: Globe2, text: "Multi-cloud · AWS · Azure · GCP" },
  { icon: Zap, text: "60 FPS on 300+ nodes" },
];

export function MarqueeStrip() {
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-space/40">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />
      <div className="flex w-max animate-marquee gap-10 py-4">
        {[...items, ...items].map((it, i) => {
          const Icon = it.icon;
          return (
            <div key={i} className="flex shrink-0 items-center gap-2 text-xs text-ink-mute">
              <Icon className="h-3.5 w-3.5 text-ai" />
              <span className="font-mono uppercase tracking-widest">{it.text}</span>
              <span className="text-ink-faint">◆</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
