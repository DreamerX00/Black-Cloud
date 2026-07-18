"use client";

import Link from "next/link";
import { FOOTER_NAV } from "@/lib/nav";
import { SiGithub, SiX, SiDiscord } from "react-icons/si";

const socials = [
  { label: "GitHub", href: "https://github.com/blackcloud", icon: SiGithub },
  { label: "X", href: "https://x.com/blackcloud", icon: SiX },
  { label: "Discord", href: "https://discord.gg/blackcloud", icon: SiDiscord },
];

export function SiteFooter() {
  return (
    <footer className="clay-panel mt-auto border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Logo + tagline */}
        <div className="mb-10 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500" />
          <div>
            <span className="text-gradient text-lg font-bold">BlackCloud</span>
            <p className="text-xs text-muted-foreground">
              Cloud infrastructure, reimagined.
            </p>
          </div>
        </div>

        {/* 4-column nav */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {FOOTER_NAV.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-violet-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} BlackCloud. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-violet-400"
                aria-label={s.label}
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
