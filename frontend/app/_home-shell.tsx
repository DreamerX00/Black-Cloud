"use client";

import { useState, useEffect, type ComponentType } from "react";

// ponytail: true runtime import — no static reference to _home-client
// so Turbopack serves this shell instantly without resolving the 1245-line module
export default function HomeShell() {
  const [Comp, setComp] = useState<ComponentType | null>(null);

  useEffect(() => {
    import("./_home-client").then((m) => setComp(() => m.default));
  }, []);

  if (!Comp) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F17]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <p className="text-sm text-white/40">Loading BlackCloud...</p>
        </div>
      </div>
    );
  }

  return <Comp />;
}
