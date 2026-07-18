export default function Loading() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 nebula opacity-30" />
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative h-24 w-24">
          {/* concentric orbits */}
          <span className="absolute inset-0 rounded-full border border-white/10" />
          <span className="absolute inset-2 rounded-full border border-white/10" />
          <span className="absolute inset-4 rounded-full border border-white/10" />
          {/* rotating ring — orbit animation from globals */}
          <span className="absolute inset-0 rounded-full border border-transparent border-t-ai animate-[orbit_1.6s_linear_infinite]" />
          <span className="absolute inset-3 rounded-full border border-transparent border-t-aws animate-[orbit_2.4s_linear_infinite_reverse]" />
          {/* core */}
          <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ai shadow-[0_0_24px_var(--color-ai)] animate-[pulse-slow_2s_ease-in-out_infinite]" />
        </div>
        <div className="text-mono-caps text-ink-mute animate-[pulse-slow_2s_ease-in-out_infinite]">
          Assembling graph…
        </div>
      </div>
    </div>
  );
}
