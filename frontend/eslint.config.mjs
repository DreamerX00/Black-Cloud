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
    // Runnable checks (Node scripts, not part of the app build).
    "**/*.check.ts",
  ]),
  {
    // Vendored React Bits components (MIT). Copy-paste library code written to
    // its own conventions — relax the strict rules here so upstream files can
    // be re-copied without hand-editing. Our own code keeps the full ruleset.
    files: ["components/reactbits/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
      "prefer-const": "off",
      "no-unused-disable": "off",
    },
  },
]);

export default eslintConfig;
