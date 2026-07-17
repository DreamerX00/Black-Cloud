import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables React's <ViewTransition> component + `<Link transitionTypes={...}>`
  // (Next 16 native — see docs/01-app/02-guides/view-transitions.md).
  // Everything in globals.css under ::view-transition-* depends on this.
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
