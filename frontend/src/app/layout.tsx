import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotionRoot } from "@/components/motion/primitives";
import { CustomCursor } from "@/components/motion/cursor";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { CommandPalette } from "@/components/command-palette";
import "./globals.css";
import "@xyflow/react/dist/style.css";

/**
 * Root Layout — the universe's outer shell.
 *
 * Font strategy (DESIGN_SYSTEM.md §Typography):
 *   Inter          → font-sans   (UI, forms, labels)
 *   Space Grotesk  → font-display (headlines, hero, marketing)
 *   JetBrains Mono → font-mono   (code, logs, technical data, brut alerts)
 *
 * Global surface providers (dark-first, DESIGN_SYSTEM.md):
 *   - ThemeProvider forces .dark class
 *   - MotionRoot   respects prefers-reduced-motion + sets ease defaults
 *   - SmoothScroll wires Lenis-powered inertial scrolling
 *   - CustomCursor  Lusion-style two-layer magnetic cursor
 *   - CommandPalette ⌘K global shortcut, listens on window
 *
 * View transitions are enabled in next.config.ts. Every `<Link>` may opt
 * in via `transitionTypes={['nav-fwd']}` or `['nav-back']` to trigger the
 * directional slide animations defined in globals.css.
 */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BlackCloud — Cloud Decision Intelligence",
    template: "%s · BlackCloud",
  },
  description:
    "Own the graph. Design, validate, simulate, and migrate multi-cloud infrastructure — before a single resource exists.",
  applicationName: "BlackCloud",
  authors: [{ name: "BlackCloud" }],
  keywords: [
    "cloud architecture",
    "AWS",
    "Azure",
    "GCP",
    "infrastructure diagram",
    "DevOps",
    "cloud decision intelligence",
    "migration",
    "cost simulator",
  ],
  openGraph: {
    title: "BlackCloud — Cloud Decision Intelligence",
    description:
      "Design, validate, simulate, and migrate multi-cloud infrastructure — before a single resource exists.",
    type: "website",
    siteName: "BlackCloud",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlackCloud",
    description: "Own the graph. Own the decision. Own the category.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground font-sans flex flex-col"
      >
        <ThemeProvider>
          <QueryProvider>
            <TooltipProvider delayDuration={200}>
              <MotionRoot>
                <SmoothScroll />
                {children}
              </MotionRoot>
            </TooltipProvider>
          </QueryProvider>
          <CustomCursor />
          <CommandPalette />
          <Toaster
            theme="dark"
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{
              className: "clay",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
