import { PROVIDER_META } from "@/lib/nodes/registry";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 tablet:grid-cols-4 tablet:px-10">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
            <span aria-hidden className="text-xl">⚫</span>
            BlackCloud
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Multi-cloud architecture, reimagined. Design, validate, and export
            infrastructure diagrams — right in the browser.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
            Providers
          </h3>
          <ul className="space-y-1.5 text-sm">
            {(["aws", "azure", "gcp"] as const).map((p) => {
              const meta = PROVIDER_META[p];
              return (
                <li key={p} className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: meta.accent }}
                  />
                  {meta.label}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {meta.count}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
            Product
          </h3>
          <ul className="space-y-1.5 text-sm">
            <li>
              <a
                href="/signup"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Get started
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground tablet:flex-row tablet:px-10">
          <p>© BlackCloud · Multi-cloud architecture, reimagined.</p>
          <p>Built with Next.js · Three.js · Motion</p>
        </div>
      </div>
    </footer>
  );
}
