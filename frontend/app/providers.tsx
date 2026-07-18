"use client";

import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { CursorSpotlight } from "@/components/effects/cursor-spotlight";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
          },
        },
      })
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <CursorSpotlight />
        <Toaster
          theme="dark"
          position="bottom-right"
          richColors
          toastOptions={{
            classNames: {
              toast:
                "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
              title: "text-white font-medium",
              description: "text-white/60",
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
