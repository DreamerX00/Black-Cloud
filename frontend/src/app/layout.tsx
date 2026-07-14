import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotionRoot } from "@/components/motion/primitives";
import "./globals.css";
import "@xyflow/react/dist/style.css";

/**
 * next/font/google self-hosts each font and exposes a `.variable` CSS custom
 * property, which globals.css `@theme` maps to Tailwind utilities:
 *   Inter          → font-sans   (UI, forms, labels)
 *   Space Grotesk  → font-display (headlines, hero, marketing)
 *   JetBrains Mono → font-mono   (code, logs, technical data)
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
    default: "BlackCloud — Cloud Decision Intelligence Platform",
    template: "%s · BlackCloud",
  },
  description:
    "Design, validate, and export cloud architectures visually across AWS, Azure, and GCP.",
  applicationName: "BlackCloud",
  authors: [{ name: "BlackCloud" }],
  keywords: [
    "cloud architecture",
    "AWS",
    "Azure",
    "GCP",
    "infrastructure diagram",
    "DevOps",
  ],
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning on <body>: browser extensions (Grammarly,
          LastPass, ColorZilla) inject data-* attrs before React hydrates.
          Targeted suppression — only skips attr diff on <body>, not children. */}
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground font-sans flex flex-col"
      >
        <ThemeProvider>
          <QueryProvider>
            <TooltipProvider delayDuration={200}>
              <MotionRoot>{children}</MotionRoot>
            </TooltipProvider>
          </QueryProvider>
          <Toaster theme="dark" position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
