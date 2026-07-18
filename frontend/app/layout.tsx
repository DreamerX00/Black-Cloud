import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/chrome/app-shell";

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
  metadataBase: new URL("https://blackcloud.dev"),
  title: {
    default: "BlackCloud — The living universe of cloud infrastructure",
    template: "%s · BlackCloud",
  },
  description:
    "Design, simulate, migrate, and understand cloud architecture as a living, interactive universe. Multi-cloud graph, AI Architect, Blast Radius, Live Twin.",
  keywords: [
    "cloud infrastructure",
    "multi-cloud",
    "AWS",
    "Azure",
    "GCP",
    "architecture design",
    "migration",
    "cost simulation",
    "failure simulator",
    "terraform",
    "infrastructure as code",
  ],
  authors: [{ name: "BlackCloud" }],
  openGraph: {
    type: "website",
    siteName: "BlackCloud",
    title: "BlackCloud — The living universe of cloud infrastructure",
    description:
      "Cloud architecture as a living, interactive universe. Multi-cloud graph, AI Architect, Blast Radius, Live Twin.",
    url: "https://blackcloud.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlackCloud",
    description: "The living universe of cloud infrastructure.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-void text-ink antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
