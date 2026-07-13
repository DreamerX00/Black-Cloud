"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * Client-side QueryClientProvider.
 * Created lazily via useState so each browser tab gets its own client and
 * SSR gets a fresh instance per request (prevents cross-request state bleed).
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,           // 1 min — infra data changes slowly
            gcTime: 5 * 60_000,          // 5 min — keep hot cache for tab-switching
            refetchOnWindowFocus: false, // canvas users tab-swap constantly; loud
            retry: 1,
          },
          mutations: { retry: 0 },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
