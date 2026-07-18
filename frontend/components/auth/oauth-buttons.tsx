export function OAuthButtons() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {[
        { label: "Google", glyph: "G", tint: "text-ink" },
        { label: "GitHub", glyph: "⌘", tint: "text-ink" },
        { label: "Microsoft", glyph: "◧", tint: "text-azure" },
      ].map(o => (
        <button
          key={o.label}
          data-cursor="magnet"
          className="glass inline-flex items-center justify-center gap-3 rounded-full py-3 text-sm text-ink transition-all hover:-translate-y-0.5"
          type="button"
        >
          <span className={`font-mono text-lg ${o.tint}`}>{o.glyph}</span>
          {o.label}
        </button>
      ))}
    </div>
  );
}
