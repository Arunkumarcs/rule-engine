import { defineConfig } from "tsup";

export default defineConfig([
  // Library build
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    outDir: "dist",
    splitting: false,
    minify: false,
    target: "esnext",
  },

  // CLI build
  {
    entry: ["src/cli.ts"],
    format: ["esm", "cjs"],
    dts: false, // Optional: skip `.d.ts` if not importing CLI
    outDir: "dist",
    clean: false,
    splitting: false,
    minify: false,
    target: "node16",
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
]);
