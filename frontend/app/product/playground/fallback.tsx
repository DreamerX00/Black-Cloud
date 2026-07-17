// Static, dependency-free hero backdrop for reduced-motion / no-WebGL users.
// Claymorphism grid + provider-tinted gradients mimicking the live scene's
// architecture. No hooks, no animation, safe to render on the server.
import { ServiceIcon } from "@/lib/brand-icons";
import { CATALOG } from "@/lib/catalog/nodes";

const PROVIDER_HEX: Record<string, string> = {
  aws: "#ff9900",
  azure: "#38bdf8",
  gcp: "#4285f4",
};

// Deterministic pick of 6 nodes to scatter across the static backdrop.
const CHIPS = [2, 5, 9, 13, 17, 20].map((i, n) => {
  const s = CATALOG[i % CATALOG.length];
  const positions = [
    { top: "18%", left: "14%" },
    { top: "26%", left: "72%" },
    { top: "58%", left: "24%" },
    { top: "44%", left: "84%" },
    { top: "70%", left: "58%" },
    { top: "32%", left: "44%" },
  ];
  return { s, pos: positions[n], hex: PROVIDER_HEX[s.provider] ?? "#8b5cf6" };
});

export function PlaygroundFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden bg-[#05060a]">
      {/* Ambient provider gradients. */}
      <div className="absolute -left-1/4 top-0 size-[60vw] rounded-full bg-accent-cyan/20 blur-[120px]" />
      <div className="absolute -right-1/4 top-1/4 size-[55vw] rounded-full bg-accent-violet/20 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 size-[45vw] rounded-full bg-provider-aws/10 blur-[120px]" />

      {/* Perspective grid floor. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(99,102,241,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.25) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to top, black, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black, transparent)",
          transform: "perspective(400px) rotateX(60deg)",
          transformOrigin: "bottom",
        }}
      />

      {/* Floating service node chips. */}
      {CHIPS.map(({ s, pos, hex }) => (
        <div
          key={`${s.provider}-${s.id}`}
          className="clay absolute flex size-16 items-center justify-center rounded-2xl p-3"
          style={{
            top: pos.top,
            left: pos.left,
            boxShadow: `0 0 40px -8px ${hex}55`,
            borderColor: `${hex}44`,
          }}
        >
          <ServiceIcon provider={s.provider} id={s.id} name={s.name} size={30} />
        </div>
      ))}
    </div>
  );
}
