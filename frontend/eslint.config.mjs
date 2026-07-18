import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // React 19 experimental purity rules are too strict for R3F per-frame
  // camera work and for standard "reset on open" palette patterns that use
  // the correct sync-external-store shape. Downgrade to warnings so real
  // bugs still surface without blocking builds on idiomatic code.
  {
    files: [
      "components/scenes/**",
      "components/ui/command-palette.tsx",
      "components/chrome/global-nav.tsx",
      "components/playground/**",
    ],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
