import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

// Self-hosted variable woff2 (latin subset) in app/fonts — no runtime Google fetch.
const geistSans = localFont({ variable: "--font-geist-sans", src: "./fonts/geist.woff2", weight: "400 700", display: "swap" });
const geistMono = localFont({ variable: "--font-geist-mono", src: "./fonts/geist-mono.woff2", weight: "400 600", display: "swap" });
// Display face for hero headlines; technical mono for code/logs/data (per DESIGN_SYSTEM).
const spaceGrotesk = localFont({ variable: "--font-display", src: "./fonts/space-grotesk.woff2", weight: "400 700", display: "swap" });
const jetbrainsMono = localFont({ variable: "--font-jetbrains", src: "./fonts/jetbrains-mono.woff2", weight: "400 600", display: "swap" });

export const metadata: Metadata = {
  title: "BlackCloud — one control plane for every cloud",
  description: "Descend through the server galaxy. Deploy across AWS, Azure, and GCP from a single cinematic control plane.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
